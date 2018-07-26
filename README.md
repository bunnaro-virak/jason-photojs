# This is just my first init package
This would be used for my project only

```shell
$ npm i -g jason-photojs
$ npm i --save jason-photojs
```

```javascript
let fs = require('fs');
let path = require('path');
let photoLib = require('./photoLib');

photoLib.init({
    imageConfig: JSON.parse(fs.readFileSync(path.resolve('.', `config/image.json`), 'utf8')),
    path: {
        root: function (pathSt) {
            return __dirname + '/../../' + pathSt;
        },
        public: function (pathSt) {
            return __dirname + '/../../public/' + pathSt;
        },
        storage: function (pathSt) {
            return __dirname + '/../storages/' + pathSt;
        }
    }
});

console.log('photoli', photoLib.getDirectory('rewards', 'photos', ['preview', 'thumbnail', 'zoom'], "hello.jpg", null))

console.log('dimension size', photoLib.fileDimensionSize('./test.jpg').then(function (data) {
    console.log('test data', data);
}, function (error) {
    console.log('error', error);
}))
```