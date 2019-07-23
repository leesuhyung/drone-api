const uuidv1 = require('uuid/v1');
const _ = require('lodash');
const {withStatusCode} = require('../../utils/response.util');
const {parseWith} = require('../../utils/request.util');
const {UserRepository} = require('../../repositories/user.repository');

const repository = new UserRepository();
const success = withStatusCode(200, JSON.stringify);
const noContent = withStatusCode(204);
const failure = withStatusCode(500, JSON.stringify);
const parseJson = parseWith(JSON.parse);

exports.list = async (event, context, callback) => {
    const params = event.queryStringParameters;

    return new Promise(async (resolve, reject) => {
        try {
            await repository.connect();
            resolve(success(await repository.list(params)));
        } catch (e) {
            reject(callback(null, failure(e)));
        }
    });
};

exports.rank = async (event, context, callback) => {
    const params = event.queryStringParameters;

    return new Promise(async (resolve, reject) => {
        try {
            await repository.connect();
            resolve(success(await repository.rank(params)));
        } catch (e) {
            reject(callback(null, failure(e)));
        }
    });
};

exports.getRank = async (event, context, callback) => {
    const {id} = event.pathParameters;

    return new Promise(async (resolve, reject) => {
        try {
            await repository.connect();
            resolve(success(await repository.getRank(id)));
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
    let user = parseJson(body);

    return new Promise(async (resolve, reject) => {
        try {
            await repository.connect();
            resolve(success(await repository.post(user)));
        } catch (e) {
            reject(callback(null, failure(e)));
        }
    });
};

exports.update = async (event, context, callback) => {
    const {body, pathParameters} = event;
    const {id} = pathParameters;

    const user = parseJson(body);

    return new Promise(async (resolve, reject) => {
        try {
            await repository.connect();
            resolve(success(await repository.update(id, user)));
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
