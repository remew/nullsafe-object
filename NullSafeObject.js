'use strict';

const Null = {};

const KEY_ROOT = Symbol();
const KEY_PATH = Symbol();

function wrap(obj, path) {
    return new Proxy(new NullSafeObject(obj, path), {
        get: function (target, key) {
            // unwrap is property of NullSafeObject
            if (key === KEY_ROOT ||
                key === KEY_PATH ||
                key === 'unwrap') {
                return Reflect.get(target, key);
            }
            return wrap(obj, [...path, key]);
        },
        set: function (target, key, value) {
            const root = Reflect.get(target, KEY_ROOT);
            const path = [...Reflect.get(target, KEY_PATH), key];
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
        this[KEY_ROOT] = obj;
        this[KEY_PATH] = path;
    }
    unwrap() {
        const root = Reflect.get(this, KEY_ROOT);
        const path = Reflect.get(this, KEY_PATH);
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

