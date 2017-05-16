'use strict';

const Null = {};

class NullSafeObject {
    constructor(value) {
        this._value = value;
    }
    unwrap() {
        const value = Reflect.get(this, '_value');
        if (value === null || value === undefined) {
            return null;
        }
        return value;
    }
    static wrap(...args) {
        if (args.length !== 1) {
            throw new TypeError('only 1 arguments required');
        }
        const obj = args[0];
        return new Proxy(new NullSafeObject(obj), {
            get: function (target, key) {
                // _value and unwrap is property of NullSafeObject
                if (key === '_value' || key === 'unwrap') {
                    return Reflect.get(target, key);
                }
                const value = target._value;
                if (value === null || value === undefined) {
                    return NullSafeObject.wrap(null);
                }

                // get return value
                const ret = value[key];

                // not working...
                /*if (typeof ret === 'function') {
                    console.log('get function', key);
                    // console.log(value instanceof Function);
                    // return value.bind(obj)(str => str.toUpperCase());
                    return ret;
                    // return new Proxy(value, {
                    //     apply: function(target, thisObj, args) {
                    //         // console.log(target);
                    //         // console.log(typeof target);
                    //         // const result = Reflect.apply(target, thisObj, args);
                    //         const bindedFunc = target.bind(thisObj);
                    //         console.log(bindedFunc instanceof Function);
                    //         args.forEach(arg => console.log(arg.toString()));
                    //         const result = bindedFunc;
                    //         console.log(result);
                    //         return result;
                    //     }
                    // });
                }*/

                // return wrapped null if return value is null or undefined
                if (ret === null || ret === undefined) {
                    // when access to undefined property
                    value[key] = {};
                    return NullSafeObject.wrap(value[key]);
                }

                // re-wrap return value
                return NullSafeObject.wrap(ret);
            },
            set: function (target, key, value) {
                if (key === '_value' || key === 'unwrap') {
                    throw new Error(`Can not assign to ${key}`);
                }
                target._value[key] = value;
                return true;
            }
        });
    }
}

module.exports = NullSafeObject;

