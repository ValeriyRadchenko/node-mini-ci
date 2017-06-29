const path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const DirectoryWatcher = require('./application/directory-watcher');
const NetSocketServer = require('./application/connection/net-socket-new/net-socket-server');
const NetSocketClient = require('./application/connection/net-socket-new/net-socket-client');
const logger = require('./application/logger/logger');
const config = require('./config');

let server = null;

function init(options) {
    const homeDir = path.resolve(config.homeDir);
    let jobs = {};

    if (!fs.existsSync(path.join(homeDir, 'jobs'))) {
        fs.mkdirSync(path.join(homeDir, 'jobs'));
    }

    if (!fs.existsSync(path.join(homeDir, 'workspace'))) {
        fs.mkdirSync(path.join(homeDir, 'workspace'));
    }

    const jobsBaseDir = path.join(homeDir, 'jobs');

    const controller = new NetSocketClient('controller');

    const directoryWatcher = new DirectoryWatcher(jobsBaseDir);

    directoryWatcher.on('new', fileName => {

        if (jobs[fileName]) {
            return false;
        }

        let child = fork(
            path.resolve(__dirname, 'application', 'job-worker.js'),
            [
                path.resolve(jobsBaseDir, fileName)
            ],
            {stdio: (!options.verbose) ? 'ignore' : null}
        );

        jobs[fileName] = child;

        child.on('close', () => {
            delete jobs[fileName];
        });

        logger.info(`new job, ${child.pid}, ${fileName}`);
    });

    directoryWatcher.on('remove', fileName => {
        controller.send('stop', jobs[fileName].pid);
        logger.info(fileName, 'is removed', jobs[fileName].pid);
        delete jobs[fileName];
    });

    directoryWatcher.watch()
        .catch(error => logger.error);

    controller.on('info', info => {
        logger.info(info);
    });

    controller.on('!stop', () => {
        console.log('!stop');
        directoryWatcher.stopWatching();
        for (let key in jobs) {
            let job = jobs[key];
            controller.send('stop', job.pid);
        }
        setTimeout(() => {
            stopServer();
            process.removeAllListeners();
        }, 2000);
    });

    logger.info('ci server is started,', `process id is ${process.pid}`);
}

function startServer(options) {

    server = new NetSocketServer();

    server.onStarted()
        .then(() => {
            init(options);
        });
}

function stopServer() {
    if (server) {
        server.close();
    }
}

if (!module.parent) {
    startServer({verbose: true});
}

exports.startServer = startServer;