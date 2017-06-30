const fs = require('fs');
const path = require('path');
const config = require('../../config');

const cliUI = require('../cli-ui');
const logger = require('../logger/logger');
const {
    addJob,
    removeJob,
    stopApplication,
    getJobsStatus,
    getConfig,
    setConfig
} = require('./index');

module.exports = function checkEntryPoint(options) {

    if (options.add) {
        return add();
    }

    if (options.remove) {
        return remove();
    }

    if (options.status) {
        return status();
    }

    if (typeof options.config !== 'undefined') {
        return userConfig(options.config);
    }

    if (options.stop) {
        stopApplication()
            .then(() => {
                fs.unlinkSync(path.resolve(config.homeDir, config.session.fileName));
                logger.info(`node-mini-ci daemon process is stopped.`);
            })
            .catch(error => logger.error);

        return true;
    }

    return false;
};

function add() {
    cliUI.add()
        .then(job => {
            return cliUI.confirm('Generated job:', job);
        })
        .then(addJob)
        .catch(error => logger.error);

    return true;
}

function remove() {
    cliUI.remove()
        .then(answer => {
            return cliUI.confirm('Are you sure that you want to remove?', answer.jobs);
        })
        .then(removeJob)
        .catch(error => logger.error);

    return true;
}

function status() {
    getJobsStatus()
        .catch(error => logger.error);

    return true;
}

function userConfig(options) {

    if (!options) {
        getConfig();
    } else {
        options = options.split(':');

        if (options.length < 2) {
            getConfig(options[0]);
            return true;
        }

        setConfig(options[0], options[1]);
    }

    return true;
}