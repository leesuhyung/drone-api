const { UserRepository, withStatusCode, parseWith, uuidv1 } = require('../_init_');

const repository = new UserRepository();
const ok = withStatusCode(200, JSON.stringify);

exports.handler = async (event, context, callback) => {
    try {
        return ok(await repository.list());
    } catch (e) {
        return callback(null, { statusCode: 404, body: JSON.stringify(e) });
    }
};
