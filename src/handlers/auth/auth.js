const jwt = require('jsonwebtoken');
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_PUBLIC_KEY = process.env.AUTH0_CLIENT_PUBLIC_KEY;

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {
        principalId: principalId
    };

    if (effect && resource) {
        Object.assign(authResponse, {
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: effect,
                        Resource: resource
                    }
                ]
            }
        });
    }

    return authResponse;
};

exports.handler = async (event, context, callback) => {
    if (!event.authorizationToken) {
        return callback('Unauthorized: Token not exist');
    }

    const tokenParts = event.authorizationToken.split(' ');
    const tokenValue = tokenParts[1];

    if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
        return callback('Unauthorized: word not match');
    }
    const options = {
        audience: AUTH0_CLIENT_ID,
    };

    try {
        jwt.verify(tokenValue, AUTH0_CLIENT_PUBLIC_KEY, options, (verifyError, decoded) => {
            if (verifyError) {
                return callback('Unauthorized: verifyError');
            }
            // is custom authorizer function
            return callback(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
        });
    } catch (err) {
        return callback('Unauthorized: catchError');
    }
};
