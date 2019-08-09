const uuidv1 = require('uuid/v1');
const _ = require('lodash');
const {withStatusCode} = require('../../utils/response.util');
const {parseWith} = require('../../utils/request.util');
const {MapRepository} = require('../../repositories/map.repository');

const repository = new MapRepository();
const success = withStatusCode(200, JSON.stringify);
const failure = withStatusCode(500, JSON.stringify);
const noContent = withStatusCode(204);
const parseJson = parseWith(JSON.parse);

exports.list = async (event, context, callback) => {
    const params = event.queryStringParameters;

    return new Promise(async (resolve, reject) => {
        try {
            await repository.connect();
            resolve(success(await repository.list(params)));
        } catch (e) {
            resolve(failure(e));
        }
    });
};

exports.add = async (event, context, callback) => {
    const {body} = event;
    let map = parseJson(body);

    return new Promise(async (resolve, reject) => {
        try {
            await repository.connect();
            resolve(success(await repository.post(map)));
        } catch (e) {
            resolve(failure(e));
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
            resolve(failure(e));
        }
    });
};
