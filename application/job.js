const OSProcessFactory = require('./factories/os-process-factory');

class Job extends OSProcessFactory {

    constructor(name, cwd) {
        super(cwd);
        this.name = name;
        this.processes = {};
        this.cwd = cwd;
    }

    runCommand(command, stdoutPipe, subCwd = this.name) {
        return new Promise((resolve, reject) => {
            let newProcess = this.executeCommand(command, subCwd);

            this.processes[newProcess.pid] = newProcess;

            if (stdoutPipe) {
                newProcess.on('stdout', data => console.log(data));
                newProcess.on('stderr', data => console.log(data));
            }

            newProcess.on('close', data => {
                delete this.processes[data.pid];
                if (data.exitCode > 0) {
                    reject(new Error(data.stderr));
                }

                resolve({stdout: data.stdout, stderr: data.stderr});
            });
        });
    }

    stop() {
        for (let key in this.processes) {
            this.processes[key].terminate();
        }
    }

}

module.exports = Job;