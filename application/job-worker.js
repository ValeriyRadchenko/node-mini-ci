const jobParamsFileName = process.argv[2];
const path = require('path');
const fs = require('fs');
const util = require('util');
const config = require('../config');
const OSProcessFactory = require('./factories/os-process-factory');
const NetSocketClient = require('./connection/net-socket-new/net-socket-client');
const logger = require('./logger/logger');
const Monitoring = require('./monitoring/monitoring');
const { getRunTime } = require('./helpers');

let workingDirectory = path.resolve(config.homeDir, 'workspace');


let Job = null;
let timer = null;
let monitoring = new Monitoring();

let jobParams = null;
try {
    jobParams = JSON.parse(fs.readFileSync(jobParamsFileName, 'utf-8'));
    Job = require(path.resolve(__dirname, 'jobs', jobParams.type));
} catch (error) {
    logger.error(error);
    process.exit(1);
}

const osProcessFactory = monitoring.applyMonitoring(new OSProcessFactory(jobParams.name, workingDirectory), 'createProcess');
let job = new Job(osProcessFactory, jobParams);
job.usage = {cpu: [0, 0], memory: [0, 0]};

monitoring.on('usage.push', usage => {
    job.usage.cpu[0] = (+job.usage.cpu[0] + +usage[1]).toFixed(2);
    job.usage.cpu[1]++;

    job.usage.memory[0] = (+job.usage.memory[0] + +usage[2]).toFixed(2);
    job.usage.memory[1]++;
});

let interval = setInterval(() => {
    job.usage = {cpu: [0, 0], memory: [0, 0]};
}, 15 * 60000);
interval.unref();

job.on('error', error => {
    logger.error(error);
    job.stop();
    timer = setTimeout(() => {
        job.restart();
    }, config.jobs.restartTimeout);
    timer.unref();
});

const protocol = new NetSocketClient('worker');

process.on('close', code => {
    protocol.send('info', `${process.argv[2]} is finished`);
});

protocol.once('connected', () => {
    protocol.send('info', `${process.argv[2]} is started`);
});

protocol.on('getStatus', () => {
    let usage = {cpu: 0, memory: 0};

    usage.cpu = `${(job.usage.cpu[0] / job.usage.cpu[1]).toFixed(2)} %`;
    usage.memory = `${(job.usage.memory[0] / job.usage.memory[1]).toFixed(2)} ${monitoring.getMemoryUnit()}`;

    protocol.send('status', {
        name: jobParams.name,
        type: jobParams.type,
        pid: process.pid,
        status: job.status,
        restarted: job.restarted,
        startTime: getRunTime(job.startTime),
        cpu: usage.cpu,
        memory: usage.memory
    });
});

protocol.on('stop', async pid => {
    if (+pid !== process.pid) {
        return false;
    }

    await job.stop();
    monitoring.destroy();
    protocol.destroy();
    process.removeAllListeners();
});
