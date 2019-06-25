const { UserRepository, withStatusCode, parseWith, uuidv1 } = require('../_init_');

const repository = new UserRepository();
const ok = withStatusCode(200, JSON.stringify);
const parseJson = parseWith(JSON.parse);

exports.handler = async (event, context, callback) => {
    const { body } = event;
    let user = parseJson(body);

    try {
        return ok(await repository.post(user));
    } catch (e) {
        return callback(null, { statusCode: 403, body: JSON.stringify(e) });
    }
};
