# nullsafe-object
Create null safe property accessible Object library for JavaScript

## What is nullsafe-object?
`nullsafe-object` is a library for create null-safe property accessible Object

if you want to use some Web API and the API return deep json. you try to access into deep property like `res.data.info.id`. however sometime Developer Console shows an error like this.
```
Uncaught TypeError: Cannot read property 'info' of undefined
```

if you use this library, you can access to deep property without above error.

## How it works?
This library using [ECMAScript Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

Proxy object can hook property access. this library's source code is simple. see it.

You can NOT use this library on IE11 because IE11 doesn't have Proxy object. but Edge has it :) [browser support information](http://caniuse.com/#search=proxy)

## Example
```javascript
const NullSafeObject = require('nullsafe-object');
const obj = {};

// this script shows error
// console.log(obj.deep.property.access);

// 1. wrap the object
const wrappedObject = NullSafeObject.wrap(obj);

// 2. access to any property
console.log(wrappedObject.deep.property.access.unwrap()); // => null

// of course normal access is enabled
const obj2 = {
    exists: {
        property: 'some string'
    }
};
const wrappedObject2 = NullSafeObject.wrap(res2);

// needs to call unwrap() method
console.log(wrappedObject2.exists.property.unwrap()); // => 'some string'
```

## Installation
```
$ npm install nullsafe-object --save
```

or

```
$ yarn add nullsafe-object
```

## License
[MIT License](http://opensource.org/licenses/MIT)


