'use strict';
let fs = require('fs');
let gm = require('gm');
let printf = require('util').format;
let helper = require('../utils/helper');
let config;
let photoLib = module.exports = {};
photoLib.init = function (configData) {
    config = configData;
};

photoLib.identify = function* (file) {
    let gmMethod = gm(file.path).options({
        imageMagick: false
    });
    let method = helper.thunkify(gmMethod.identify, gmMethod);
    return yield method();
};

photoLib.stat = function* (file) {
    let method = helper.thunkify(fs.stat, fs);
    return yield method(file.path);
};

photoLib.removePhoto = function* (photoKeys) {
    assert(Root._.isArray(photoKeys), 'Photo is not valid');
    photoKeys = Root._.filter(photoKeys, function (v) {
        return !!v;
    });
    let keys = Root._.map(photoKeys, function (v) {
        return {
            Key: v
        };
    });
    let method = helper.thunkify(s3bucket.deleteObjects, s3bucket);
    let result = yield method({
        // Bucket: 'myprivatebucket/some/subfolders',
        Delete: {
            Objects: keys
        }
    });
    return result;
};

photoLib.getDirectory = function (refType, photoType, sizes, filename, reference_id) {
    let result = {
        fullDirPath: {},
        fullFilePath: {},
        linkPath: {}
    };
    sizes.forEach(function (v, k) {
        let path = printf(config.imageConfig[refType][photoType].directory, reference_id || 'shares', v);
        result.fullDirPath[v] = config.path.public(path);
        result.fullFilePath[v] = result.fullDirPath[v] + filename;
        result.linkPath[v] = path + filename;
    });
    return result;
};

photoLib.fileDimensionSize = function (filePath) {
    return new Promise(function (resolve, reject) {
        try {
            // tmp path 
            let tmpPath = config.path.storage('tmp-image' + new Date().getTime() + Math.random() * 1000 + '.jpg');
            gm(filePath)
                .options({
                    imageMagick: false
                })
                .autoOrient()
                .write(tmpPath, function (err) {
                    if (err) {
                        // Logger.error('photoLib::resize::size\t\t' + err);
                        return reject(err);
                    }
                    gm(tmpPath)
                        .options({
                            imageMagick: false
                        })
                        .autoOrient()
                        .size(function (err, value) {
                            if (err) {
                                // Logger.error('photoLib::resize::size\t\t' + err);
                                return reject(err);
                            }
                            resolve(value);
                            fs.unlink(tmpPath, function () {});
                        });
                    gm(tmpPath)
                        .options({
                            imageMagick: false
                        })
                        .autoOrient()
                        .identify(function (err, value) {
                            console.log('Identify result:', err, value);
                        });
                });

        } catch (e) {
            reject(e);
        }
    });
}