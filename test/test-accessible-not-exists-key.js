const test = require('ava');
const NullSafeObject = require('..');
const srcObj = {
};

test('accessible not exists key', t => {
    const obj = NullSafeObject.create(srcObj);

    t.truthy(obj.key);
    t.truthy(obj.deep.property.access);
});

