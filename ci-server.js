const path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const DirectoryWatcher = require('./application/directory-watcher');
const { getProtocol } = require('./application/connection/root-protocol');

let jobsBaseDir = path.resolve(__dirname, 'jobs');

if (process.env.NODE_CI_HOME) {
    let homeDir = path.resolve(process.env.NODE_CI_HOME);

    if (!fs.statSync(path.join(homeDir, 'jobs'))) {
        fs.mkdirSync(path.join(homeDir, 'jobs'));
    }

    if (!fs.statSync(path.join(homeDir, 'workspace'))) {
        fs.mkdirSync(path.join(homeDir, 'workspace'));
    }

    jobsBaseDir = path.join(homeDir, 'jobs');
}

const directoryWatcher = new DirectoryWatcher(jobsBaseDir);


let jobs = {};

directoryWatcher.on('new', fileName => {

    if (jobs[fileName]) {
        return false;
    }

    let child = fork(
        path.resolve(__dirname, 'application', 'job-worker.js'),
        [
            path.resolve(jobsBaseDir, fileName)
        ],
        // {stdio: 'ignore'}
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