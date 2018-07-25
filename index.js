module.exports.area = radius => Math.PI * radius * radius;
module.exports.photoLib = require('./photoLib');

let photoLib = require('./photoLib');
console.log('test===')
console.log('photoli', photoLib.getDirectory())