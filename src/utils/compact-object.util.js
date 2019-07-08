const compactObject = (obj) => {
    Object.keys(obj).forEach((v) => {
        if (!obj.hasOwnProperty(v)) {
            return;
        }

        if (typeof obj[v] === 'object' && obj[v] !== null) {
            compactObject(obj[v]);
        }

        if (!obj[v] || (typeof obj[v] === 'object' && Object.keys(obj[v]).length === 0)) {
            delete obj[v];
        }
    });
};

module.exports = {
    compactObject
};
