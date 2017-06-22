const production = require('./config/config-production');
const development = require('./config/config-development');

module.exports = (process.env.NODE_ENV === 'development') ? redefine(development) : redefine(production);

function redefine(config) {
    const { NODE_CI_HOME } = process.env;

    config.homeDir = (NODE_CI_HOME) ? NODE_CI_HOME.trim() : '.';

    return config;
}