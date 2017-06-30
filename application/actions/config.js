const fs = require('fs');
const path = require('path');
const config = require('../../config');

exports.getConfig = function getConfig(stringPath) {

    if (!stringPath) {
        return console.log(config);
    }

    let arrayPath = stringPath.split('.');
    let value = getDeepValue(arrayPath, config);

    console.log(value);
};

exports.setConfig = function setConfig(stringPath, value) {

    const userConfigPath = path.resolve(config.homeDir, 'config.json');

    let additionalConfig = {};
    let arrayPath = stringPath.split('.');
    let newConfigValue = {};

    if (fs.existsSync(userConfigPath)) {
        try {
            additionalConfig = JSON.parse(fs.readFileSync(userConfigPath));
        } catch (error) {
        }
    }

    createDeepPath(arrayPath, newConfigValue, value);

    let newConfig = Object.assign(additionalConfig, newConfigValue);
    fs.writeFileSync(path.resolve(config.homeDir, 'config.json'), JSON.stringify(newConfig, null, 4));

};

function createDeepPath(arrayPath, object, value) {

    let key = arrayPath.shift();
    object[key] = {};

    if (arrayPath.length < 1) {
        object[key] = value;
        return;
    }

    createDeepPath(arrayPath, object[key], value);
}

function getDeepValue(arrayPath, object) {

    let key = arrayPath.shift();
    object = object[key];

    if (arrayPath.length < 1) {
        return object;
    }

    return getDeepValue(arrayPath, object);
}