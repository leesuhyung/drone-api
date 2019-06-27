const uuidv1 = require('uuid/v1');
const _ = require('lodash');
const {withStatusCode} = require('../../utils/response.util');
const {parseWith} = require('../../utils/request.util');
const {ResultRepository} = require('../../repositories/result.repository');

const repository = new ResultRepository();
const success = withStatusCode(200, JSON.stringify);
const noContent = withStatusCode(204);
const parseJson = parseWith(JSON.parse);

exports.list = async (event, context, callback) => {
    const params = event.queryStringParameters;

    try {
        await repository.connect();
        return success(await repository.list(params));
    } catch (e) {
        return callback(null, { statusCode: 404, body: JSON.stringify(e) });
    }
};

exports.get = async (event, context, callback) => {
    const {id} = event.pathParameters;

    try {
        await repository.connect();
        return success(await repository.get(id));
    } catch (e) {
        return callback(null, { statusCode: 404, body: JSON.stringify(e) });
    }
};

exports.add = async (event, context, callback) => {
    const {body} = event;
    let result = parseJson(body);

    try {
        await repository.connect();
        return success(await repository.post(result));
    } catch (e) {
        return callback(null, {statusCode: 403, body: JSON.stringify(e)});
    }
};

exports.delete = async (event, context, callback) => {
    const {id} = event.pathParameters;

    try {
        await repository.connect();
        await repository.delete(id);
        return noContent();
    } catch (e) {
        return callback(null, {statusCode: 400, body: JSON.stringify(e)});
    }
};
