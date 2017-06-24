const production = require('./config/config-production');
const development = require('./config/config-development');
const path = require('path');
const os = require('os');

module.exports = (process.env.NODE_ENV === 'development') ? redefine(development) : redefine(production);

function redefine(config) {
    const { NODE_CI_HOME } = process.env;

    config.homeDir = (NODE_CI_HOME) ? NODE_CI_HOME.trim() : getDefaultHomeDir();
    config.sessionFilePath = path.resolve(config.homeDir, config.session.fileName);

    return config;
}

function getDefaultHomeDir() {
    const { HOME } = process.env;

    let defaultHomeDir = (HOME) ? path.resolve(HOME, 'node-ci') : null;

    if (os.platform() === 'win32') {
        return defaultHomeDir || 'C:\\node-ci';
    }

    return defaultHomeDir || '~/node-ci';
}