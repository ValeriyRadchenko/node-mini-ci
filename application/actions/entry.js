const cliUI = require('../cli-ui');
const logger = require('../logger/logger');
const { addJob, removeJob } = require('./index');

module.exports = function checkEntryPoint(options) {

    if (options.add) {
        return add();
    }

    if (options.remove) {
        return remove();
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