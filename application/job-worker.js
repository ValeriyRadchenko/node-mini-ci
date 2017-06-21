const jobParamsFileName = process.argv[2];
const path = require('path');
const fs = require('fs');
const util = require('util');
const config = require('../config');
const OSProcessFactory = require('./factories/os-process-factory');
const { getClientProtocol } = require('./connection/root-protocol');
const logger = require('./logger/logger');

const { NODE_CI_HOME } = process.env;
let workingDirectory = (NODE_CI_HOME) ? path.resolve(NODE_CI_HOME, 'workspace') : '.';

let Job = null;

let jobParams = null;
try {
    jobParams = JSON.parse(fs.readFileSync(jobParamsFileName, 'utf-8'));
    Job = require(path.resolve(__dirname, 'jobs', jobParams.type));
} catch (error) {
    logger.error(error);
    process.exit(1);
}

const protocol = getClientProtocol();

protocol.info({
    pid: process.pid,
    message: `${process.argv[2]} is started`
});

const osProcessFactory = new OSProcessFactory(jobParams.name, workingDirectory);
let job = new Job(osProcessFactory, jobParams);

process.on('exit', code => {
    protocol.info({
        pid: process.pid,
        message: `${process.argv[2]} is finished`
    });
});

protocol.on('command.stop', async () => {
    await job.stop();
    process.removeAllListeners();
});
