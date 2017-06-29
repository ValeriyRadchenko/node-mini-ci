const logger = require('../logger/logger');
const fs = require('fs');
const path = require('path');
const config = require('../../config');

module.exports = function removeJob(jobs) {
    if (!jobs) {
        return false;
    }

    for (let jobName of jobs) {
        fs.unlinkSync(path.resolve(config.homeDir, 'jobs', jobName));
    }
};