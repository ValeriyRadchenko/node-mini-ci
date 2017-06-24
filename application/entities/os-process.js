const EventEmitter = require('events');
const { exec } = require('child_process');
const os = require('os');

class OSProcess extends EventEmitter {

    constructor(command, cwd) {
        super();
        this.command = command;
        this.cwd = cwd;
        this.systemProcess = null;
        this.stdout = '';
        this.pid = 0;
        this.promise = this.init();
    }

    init() {
        return new Promise((resolve, reject) => {
            this.systemProcess = exec(this.command, {cwd: this.cwd}, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                }

                resolve({stdout, stderr});
            });

            this.pid = this.systemProcess.pid;

            this.systemProcess.stdout.on('data', data => {
                this.stdout += data;
                this.emit('data', data);
            });

            this.systemProcess.stderr.on('data', data => {
                this.stdout += data;
                this.emit('data', data);
            });

            this.systemProcess.on('exit', exitCode => {
                this.emit('exit', {
                    stdout: this.stdout,
                    pid: this.systemProcess && this.systemProcess.pid,
                    exitCode
                });
            });
        });
    }

    wait() {
        return this.promise;
    }

    terminate() {
        return new Promise(resolve => {
            if (!this.systemProcess) {
                return;
            }

            if (os.platform() === 'win32') {
                exec(`taskkill /pid ${this.systemProcess.pid} /T /F`, () => {
                    resolve();
                });
            } else {
                this.systemProcess.kill('SIGINT');
                resolve();
            }

            this.stdout = '';
            this.systemProcess = null;
        });
    }

}

module.exports = OSProcess;