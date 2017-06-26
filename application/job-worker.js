const jobParamsFileName = process.argv[2];
const path = require('path');
const fs = require('fs');
const util = require('util');
const config = require('../config');
const OSProcessFactory = require('./factories/os-process-factory');
const { getClientProtocol } = require('./connection/root-protocol');
const logger = require('./logger/logger');
const applyMonitoring = require('./monitoring/monitoring-decorator');

let workingDirectory = path.resolve(config.homeDir, 'workspace');

let Job = null;

let jobParams = null;
try {
    jobParams = JSON.parse(fs.readFileSync(jobParamsFileName, 'utf-8'));
    Job = require(path.resolve(__dirname, 'jobs', jobParams.type));
} catch (error) {
    logger.error(error);
    process.exit(1);
}

const osProcessFactory = applyMonitoring(new OSProcessFactory(jobParams.name, workingDirectory), 'createProcess');
let job = new Job(osProcessFactory, jobParams);

job.on('error', error => {
    logger.error(error);
    job.stop();
    setTimeout(() => {
        job.restart();
    }, config.jobs.restartTimeout);
});

const protocol = getClientProtocol();

process.on('close', code => {
    protocol.info({
        pid: process.pid,
        message: `${process.argv[2]} is finished`
    });
});

protocol.info({
    pid: process.pid,
    message: `${process.argv[2]} is started`
});

protocol.on('command.stop', async pid => {
    if (pid !== process.pid) {
        return false;
    }

    await job.stop();
    protocol.destroy();
    process.removeAllListeners();
});
