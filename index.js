const commandLineArgs = require('command-line-args');
const { spawn, fork, exec } = require('child_process');
const { startServer } = require('./ci-server');
const fs = require('fs');
const path = require('path');
const cliUI = require('./application/cli-ui');
const logger = require('./application/logger/logger');
const optionDefinitions = [
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'daemon', alias: 'd', type: Boolean },
    { name: 'add', alias: 'a', type: Boolean }
];

const options = commandLineArgs(optionDefinitions);
const SESSION_FILE_PATH = path.resolve(__dirname, 'session.dat');

if (options.add) {

    cliUI.add()
        .then(job => {
            return cliUI.confirm('Generated job:', job);
        })
        .then(job => {
            if (!job) {
                console.log('false', job);
                return false;
            }

            try {
                let session = JSON.parse(fs.readFileSync(SESSION_FILE_PATH));
                console.log(path.resolve(session.nodeCIHome, 'jobs'));
                fs.writeFileSync(path.resolve(session.nodeCIHome, 'jobs', `${job.name}.json`), JSON.stringify(job));
            } catch (error) {
                logger.error(error);
            }
        })
        .catch(error => logger.error);

    return true;
}

if (options.daemon) {

    let child = spawn('node',['ci-server.js'], {detached: true, stdio: 'ignore'});
    child.unref();

    let session = {
        pid: child.pid,
        nodeCIHome: process.env.NODE_CI_HOME.trim()
    };
console.log(SESSION_FILE_PATH, JSON.stringify(session));
    fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session));
    console.log(`Daemon process id is ${child.pid}`);

} else {
    startServer(options);
}
