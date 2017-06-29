const logger = require('../logger/logger');
const fs = require('fs');
const path = require('path');
const config = require('../../config');

module.exports = function addJob(job) {
    if (!job) {
        return false;
    }

    try {
        fs.writeFileSync(path.resolve(config.homeDir, 'jobs', `${job.name}.json`), JSON.stringify(job));
    } catch (error) {
        logger.error(error);
    }
};