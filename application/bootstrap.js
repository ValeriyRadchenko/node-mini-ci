const { spawn } = require('child_process');
const { saveSession } = require('./session/session');
const path = require('path');
const logger = require('./logger/logger');

module.exports = function bootstrap() {

    let child = spawn('node',['ci-server.js'], {detached: true, stdio: 'ignore', cwd: path.resolve(__dirname, '..')});
    child.unref();

    saveSession({
        pid: child.pid
    });

    logger.info(`Daemon process id is ${child.pid}`);
};