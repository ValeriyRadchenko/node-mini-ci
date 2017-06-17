const production = require('./config/config-production');
const development = require('./config/config-development');

module.exports = (process.env.NODE_ENV === 'development') ? development : production;