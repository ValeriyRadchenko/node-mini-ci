const EventEmitter = require('events');
const exec = require('child_process').exec;
const path = require('path');
const os = require('os');

class OSProcess extends EventEmitter {

    constructor(cwd) {
        super();
        this.jobProcess = null;
        this.cwd = path.resolve(cwd);
        this.platform = os.platform();
        this.pid = 0;
    }

    execute(command) {
        this.jobProcess = exec(command, {cwd: this.cwd, detached: true});
        this.pid = this.jobProcess.pid;
        return this.jobProcess;
    }

    terminate() {
        if (this.platform === 'win32') {
            exec(`taskkill /pid ${this.jobProcess.pid} /T /F`);
        } else {
            this.jobProcess.kill('SIGINT');
        }
    }

}

module.exports = OSProcess;