const path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const DirectoryWatcher = require('./application/directory-watcher');
const { getProtocol } = require('./application/connection/root-protocol');

const JOBS_BASE_DIR = path.resolve(__dirname, 'jobs');
const directoryWatcher = new DirectoryWatcher(JOBS_BASE_DIR);

let jobs = {};

directoryWatcher.on('new', fileName => {

    if (jobs[fileName]) {
        return false;
    }

    let child = fork(
        path.resolve(__dirname, 'application', 'job-worker.js'),
        [
            path.resolve(JOBS_BASE_DIR, fileName)
        ],
        {stdio: 'ignore'}
    );

    jobs[fileName] = { job: child, protocol: getProtocol(child) };

    child.on('exit', () => {
       delete jobs[fileName];
    });

    console.log('new job', child.pid, fileName);
});

directoryWatcher.on('remove', fileName => {
    jobs[fileName].protocol.command('stop');
    console.log(fileName, 'is removed', jobs[fileName].job.pid);
    delete jobs[fileName];
});

directoryWatcher.watch()
    .catch(error => console.error);

console.log('ci server is started,', `process id is ${process.pid}`);