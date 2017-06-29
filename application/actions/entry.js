const fs = require('fs');
const path = require('path');
const config = require('../../config');

const cliUI = require('../cli-ui');
const logger = require('../logger/logger');
const Table = require('cli-table');
const colors = require('colors');
const { addJob, removeJob, stopApplication, getJobsStatus } = require('./index');

module.exports = function checkEntryPoint(options) {

    if (options.add) {
        return add();
    }

    if (options.remove) {
        return remove();
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

    if (options.status) {

        getJobsStatus()
            .then(jobsStatus => {
                const table = new Table({
                    head: ['Name', 'Type', 'pid', 'Status', 'Restarts', 'Start time', 'CPU(avr)', 'Memory(avr)']
                        .map(item => item.cyan)
                });

               Object.keys(jobsStatus)
                    .forEach(key => {
                        let status = jobsStatus[key];
                        let array = [];

                        for (let itemName in status) {

                            if (itemName === 'status') {
                                let value = status[itemName];
                                status[itemName] = (value === 'error') ? value.red : value.green;
                            }

                            array.push(status[itemName]);
                        }

                        table.push(array);
                    });

                console.log(table.toString());
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