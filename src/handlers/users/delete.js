const { UserRepository, withStatusCode, parseWith, uuidv1 } = require('../_init_');

const repository = new UserRepository();
const noContent = withStatusCode(204);

exports.handler = async (event, context, callback) => {
    const {id} = event.pathParameters;

    try {
        await repository.connect();
        await repository.delete(id);
        return noContent();
    } catch (e) {
        return callback(null, { statusCode: 400, body: JSON.stringify(e) });
    }
};
