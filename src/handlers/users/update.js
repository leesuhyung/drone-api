const { UserRepository, withStatusCode, parseWith, uuidv1, _ } = require('../_init_');

const repository = new UserRepository();
const ok = withStatusCode(200, JSON.stringify);
const parseJson = parseWith(JSON.parse);

exports.handler = async (event, context, callback) => {
    const {body, pathParameters} = event;
    const {id} = pathParameters;

    const user = parseJson(body);

    try {
        await repository.connect();
        return ok(await repository.update(id, user));
    } catch (e) {
        return callback(null, { statusCode: 403, body: JSON.stringify(e) });
    }
};
