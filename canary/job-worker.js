const path = require('path');
const OSProcessFactory = require('./factories/os-process-factory');
const Job = require(path.resolve(__dirname, 'jobs', process.argv[2]));
const { getProtocol } = require('./connection/root-protocol');

let jobParams = require('../jobs/test-job.json');
const protocol = getProtocol();

protocol.info({
    pid: process.pid,
    message: `${process.argv[2]} is started`
});

const osProcessFactory = new OSProcessFactory(jobParams.name, '.');
let job = new Job(osProcessFactory, jobParams);

process.on('exit', code => {
    protocol.info({
        pid: process.pid,
        message: `${process.argv[2]} is finished`
    });
});

protocol.on('command.stop', async () => {
    await job.stop();
    process.exit(0);
});
