const uuidv1 = require('uuid/v1');
const _ = require('lodash');
const {withStatusCode} = require('../../utils/response.util');
const {parseWith} = require('../../utils/request.util');
const {UserRepository} = require('../../repositories/user.repository');

const repository = new UserRepository();
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

exports.rank = async (event, context, callback) => {
    const params = event.queryStringParameters;
    // await repository.ranking();
    // return success();
    console.log(params);

    try {
        await repository.connect();
        return success(await repository.rank(params));
    } catch (e) {
        return callback(null, { statusCode: 404, body: JSON.stringify(e) });
    }
};

exports.getRank = async (event, context, callback) => {
    const {id} = event.pathParameters;
    const params = event.queryStringParameters;

    try {
        await repository.connect();
        return success(await repository.getRank(id, params));
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
    let user = parseJson(body);

    try {
        await repository.connect();
        return success(await repository.post(user));
    } catch (e) {
        return callback(null, {statusCode: 403, body: JSON.stringify(e)});
    }
};

exports.update = async (event, context, callback) => {
    const {body, pathParameters} = event;
    const {id} = pathParameters;

    const user = parseJson(body);

    try {
        await repository.connect();
        return success(await repository.update(id, user));
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
