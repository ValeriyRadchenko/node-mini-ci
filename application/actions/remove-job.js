const logger = require('../logger/logger');
const fs = require('fs');
const path = require('path');
const { getSession } = require('../session/session');

module.exports = function removeJob(jobs) {
    if (!jobs) {
        return false;
    }

    for (let jobName of jobs) {
        fs.unlinkSync(path.resolve(getSession().nodeCIHome, 'jobs', jobName));
    }
};