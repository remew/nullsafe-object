const test = require('ava');
const NullSafeObject = require('..');
const srcObj = {
    key: 'value',
    deep: {
        property: {
            access: true
        }
    }
};

test('accessible exists key', t => {
    const obj = NullSafeObject.create(srcObj);
    t.is(obj.key, 'value');
    t.is(obj.deep.property.access, true);
});
test('accessible not exists key in deep', t => {
    const obj = NullSafeObject.create(srcObj);
    t.truthy(obj.deep.other_property.access);
});

