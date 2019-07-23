const uuidv1 = require('uuid/v1');
const _ = require('lodash');
const {withStatusCode} = require('../../utils/response.util');
const {parseWith} = require('../../utils/request.util');
const {ResultRepository} = require('../../repositories/result.repository');
const {compactObject} = require('../../utils/compact-object.util');

const repository = new ResultRepository();
const success = withStatusCode(200, JSON.stringify);
const failure = withStatusCode(500, JSON.stringify);
const noContent = withStatusCode(204);
const parseJson = parseWith(JSON.parse);

exports.list = async (event, context, callback) => {
    const params = event.queryStringParameters;
    let filters = {
        $or: [],
        $and: [],
    };

    if (params) {
        if (params.user) {
            filters.$and.push({
                $or: [
                    {winner: params.user},
                    {loser: params.user}
                ]
            });
        }

        if (params.map) {
            filters.$and.push({
                map: params.map
            });
        }

        if (params.startResultedAt && params.endResultedAt) {
            filters.$and.push({
                resultedAt: {
                    $gte: params.startResultedAt,
                    $lte: params.endResultedAt
                }
            });
        }

        if (params.tier) {
            const tier = Object.keys(JSON.parse(params.tier)).map(k => k);
            filters.$and.push({
                $or: [
                    {'winnerData.tier': {$in: tier}},
                    {'loserData.tier': {$in: tier}}
                ]
            })
        }
    }

    compactObject(filters);

    return new Promise(async (resolve, reject) => {
        try {
            await repository.connect();
            resolve(success(await repository.list(filters)));
        } catch (e) {
            reject(callback(null, failure(e)));
        }
    });
};

exports.get = async (event, context, callback) => {
    const {id} = event.pathParameters;

    return new Promise(async (resolve, reject) => {
        try {
            await repository.connect();
            resolve(success(await repository.get(id)));
        } catch (e) {
            reject(callback(null, failure(e)));
        }
    });
};

exports.add = async (event, context, callback) => {
    const {body} = event;
    let result = parseJson(body);

    return new Promise(async (resolve, reject) => {
        try {
            await repository.connect();
            resolve(success(await repository.post(result)));
        } catch (e) {
            reject(callback(null, failure(e)));
        }
    });
};

exports.delete = async (event, context, callback) => {
    const {id} = event.pathParameters;

    return new Promise(async (resolve, reject) => {
        try {
            await repository.connect();
            await repository.delete(id);
            resolve(noContent());
        } catch (e) {
            reject(callback(null, failure(e)));
        }
    });
};
