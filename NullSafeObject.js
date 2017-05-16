'use strict';

const Null = {};

function wrap(obj, path) {
    return new Proxy(new NullSafeObject(obj, path), {
        get: function (target, key) {
            // _value and unwrap is property of NullSafeObject
            if (key === '_root' ||
                key === '_path' ||
                key === 'unwrap') {
                return Reflect.get(target, key);
            }
            return wrap(obj, [...path, key]);
        },
        set: function (target, key, value) {
            const root = Reflect.get(target, '_root');
            const path = [...Reflect.get(target, '_path'), key];
            let current = root;
            // console.log(root);
            for (let i = 0; i < path.length - 1; i++) {
                let next = current[path[i]];
                if (next === null || next === undefined) {
                    next = current[path[i]] = {};
                }
                current = next;
            }
            current[path[path.length - 1]] = value;
            return true;
        }
    });
}

class NullSafeObject {
    constructor(obj, path = []) {
        this._root = obj;
        this._path = path;
    }
    unwrap() {
        const root = Reflect.get(this, '_root');
        const path = Reflect.get(this, '_path');
        let current = root;
        for (let i = 0; i < path.length; i++) {
            const next = current[path[i]];
            if (next === null || next === undefined) {
                return null;
            }
            current = next;
        }
        return current;
    }
    static wrap(...args) {
        if (args.length !== 1) {
            throw new TypeError('only 1 arguments required');
        }
        const obj = args[0];
        return wrap(obj, []);
    }
}

module.exports = NullSafeObject;

