
function create(obj) {
    return new Proxy(obj, {
        get(target, key) {
            if (key in target) {
                const value = target[key];
                if (typeof value === 'object') {
                    return target[key] = create(value);
                }
                return target[key];
            }
            target[key] = create({});
            return target[key];
        }
    });
}

module.exports = {
    create,
};

