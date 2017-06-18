const path = require('path');
const OSProcessFactory = require('./factories/os-process-factory');
const Job = require(path.resolve(__dirname, 'jobs', process.argv[2]));

let jobParams = require('../jobs/test-job.json');


process.send({
    pid: process.pid,
    message: `${process.argv[2]} is started`
});

const osProcessFactory = new OSProcessFactory(jobParams.name, '.');
let job = new Job(osProcessFactory, jobParams);

process.on('exit', code => {
    process.send({
        pid: process.pid,
        message: `${process.argv[2]} is finished`
    });
});

process.on('message', message => {
    console.log(message);
    if (message.type === 'command') {
        if (message.command === 'stop') {
            job.stop();
            process.exit(0);
        }
    }
});
