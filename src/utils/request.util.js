const parseWith = (parser) => (text) => {
    if (!parser) {
        throw new Error('parser not exist');
    }

    if (!text) {
        throw new Error('text not exist');
    }

    return parser(text);
};

module.exports = {
    parseWith
};
