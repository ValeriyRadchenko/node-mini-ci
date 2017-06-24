const { spawn } = require('child_process');
const { saveSession } = require('./session/session');
const path = require('path');

module.exports = function bootstrap() {

    let child = spawn('node',['ci-server.js'], {detached: true, stdio: 'ignore', cwd: path.resolve(__dirname, '..')});
    child.unref();

    saveSession({
        pid: child.pid
    });

    console.log(`Daemon process id is ${child.pid}`);
};