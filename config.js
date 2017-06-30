const production = require('./config/config-production');
const development = require('./config/config-development');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { merge } = require('./application/helpers');

module.exports = (process.env.NODE_ENV === 'development') ? redefine(development) : redefine(production);

function redefine(config) {
    const { NODE_CI_HOME } = process.env;

    config.homeDir = (NODE_CI_HOME) ? NODE_CI_HOME.trim() : getDefaultHomeDir();
    config.sessionFilePath = path.resolve(config.homeDir, config.session.fileName);

    const userConfigPath = path.resolve(config.homeDir, 'config.json');

    if (!fs.existsSync(userConfigPath)) {
        return config;
    }

    try {
        let userConfig = JSON.parse(fs.readFileSync(userConfigPath));
        config = merge(config, userConfig);
    } catch (error) {
        throw error;
    }

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