const path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const DirectoryWatcher = require('./application/directory-watcher');
const { getServerProtocol } = require('./application/connection/root-protocol');
const logger = require('./application/logger/logger');
const config = require('./config');

function startServer(options) {

    const protocol = getServerProtocol();
    let procesesUsage = {};

    const homeDir = path.resolve(config.homeDir);

    if (!fs.existsSync(path.join(homeDir, 'jobs'))) {
        fs.mkdirSync(path.join(homeDir, 'jobs'));
    }

    if (!fs.existsSync(path.join(homeDir, 'workspace'))) {
        fs.mkdirSync(path.join(homeDir, 'workspace'));
    }

    const jobsBaseDir = path.join(homeDir, 'jobs');

    protocol.on('protocol.error', logger.error);

    protocol.on('statistic.pidusage.push', usage => {
        procesesUsage[usage[0]] = usage;
    });

    protocol.on('statistic.pidusage.remove', pid => {
        delete procesesUsage[pid];
    });

    protocol.on('command.getUsage', () => {
        console.log('command.getUsage');
        protocol.statistic('allUsage', procesesUsage);
    });

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
            {stdio: (!options.verbose) ? 'ignore' : null}
        );

        jobs[fileName] = child;

        child.on('exit', () => {
            delete jobs[fileName];
        });

        logger.info(`new job, ${child.pid}, ${fileName}`);
    });

    directoryWatcher.on('remove', fileName => {
        logger.info(fileName, 'is removed', jobs[fileName].pid);
        delete jobs[fileName];
    });

    directoryWatcher.watch()
        .catch(error => logger.error);

    logger.info('ci server is started,', `process id is ${process.pid}`);
}

if (!module.parent) {
    startServer({verbose: true});
}

exports.startServer = startServer;