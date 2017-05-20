const test = require('ava');
const NullSafeObject = require('..');

const srcObj = {
    key: 'value',
    deep: {
        property: {
            access: true
        }
    },
    _value: 'value',
    _path: 'path',
    arr: [
        'apple',
        'banana',
        'cherry'
    ]
};

test('NullSafeObject.wrap() creates a object', t => {
    const obj = NullSafeObject.wrap(srcObj);
    t.truthy(obj);
    t.is(typeof obj, 'object');
});
// test('Created object is deep equals to source object', t => {
//     const obj = NullSafeObject.wrap(srcObj);
//     t.deepEqual(obj, srcObj);
// });
test('Wrapped object is instance of NullSafeObject', t => {
    const obj = NullSafeObject.wrap(srcObj);
    t.truthy(obj instanceof NullSafeObject);
});
test('Instance of NullSafeObject has unwrap() method', t => {
    const obj = NullSafeObject.wrap(srcObj);
    t.is(typeof obj.unwrap, 'function');
});
test('NullSafeObject#unwrap() return built-in type', t => {
    const obj = NullSafeObject.wrap(srcObj);
    t.is(typeof obj.unwrap(), 'object');
    t.deepEqual(obj.unwrap(), srcObj);
    t.is(obj.key.unwrap(), 'value');
    t.is(obj.deep.property.access.unwrap(), true);
});
test('it allows to access/call child property but it returns NullSafeObject', t => {
    const obj = NullSafeObject.wrap(srcObj);
    t.truthy(obj.key.length);
    t.is(typeof obj.key.length, 'object');
    t.truthy(obj.key.length instanceof NullSafeObject);
    t.is(obj.key.length.unwrap(), srcObj.key.length);

    t.truthy(obj.arr.map);
    // t.is(typeof obj.arr.map, 'object');
    // t.is(typeof obj.arr.map, 'function');
    t.deepEqual(obj.arr.map(str => str.toUpperCase()).unwrap(), ['APPLE', 'BANANA', 'CHERRY']);
});
test('It can null-safe method chaining', t => {
    const obj = NullSafeObject.wrap(srcObj);
    t.deepEqual(obj.arr.map(str => str.toUpperCase()).reverse().unwrap(), ['CHERRY', 'BANANA', 'APPLE']);
    t.is(obj.arr.map(str => str.toUpperCase()).not_found_method().reverse().unwrap(), null);
});
test('return source property when access to _value or _path', t => {
    const obj = NullSafeObject.wrap(srcObj);
    t.is(obj._value.unwrap(), 'value');
    t.is(obj._path.unwrap(), 'path');
});
test('Return null when unwrap() method called by undefined property', t => {
    const obj = NullSafeObject.wrap(srcObj);
    t.is(obj.deep.other_property.access.unwrap(), null);
});
test('Grow new property in source object when set new property to wrapped object', t => {
    const obj = NullSafeObject.wrap(srcObj);
    obj.new_property = 'created';
    t.is(srcObj.new_property, 'created');
});
test('Grow new deep property in source object when set new deep property to wrapped object', t => {
    const obj = NullSafeObject.wrap(srcObj);
    obj.new_deep.property = 'created';
    t.is(srcObj.new_deep.property, 'created');
});

