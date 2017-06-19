const jobParamsFileName = process.argv[2];
const path = require('path');
const fs = require('fs');
const util = require('util');
const OSProcessFactory = require('./factories/os-process-factory');
const { getProtocol } = require('./connection/root-protocol');

const { NODE_CI_HOME } = process.env;
let workingDirecory = (NODE_CI_HOME) ? path.resolve(NODE_CI_HOME, 'workspace') : '.';

let Job = null;

let jobParams = null;
try {
    jobParams = JSON.parse(fs.readFileSync(jobParamsFileName, 'utf-8'));
    Job = require(path.resolve(__dirname, 'jobs', jobParams.type));
} catch (error) {
    console.error(error);
    process.exit(1);
}

const protocol = getProtocol();

protocol.info({
    pid: process.pid,
    message: `${process.argv[2]} is started`
});


const osProcessFactory = new OSProcessFactory(jobParams.name, workingDirecory);
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
