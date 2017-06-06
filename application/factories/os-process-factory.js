const OSProcess = require('../os-process');
const EventEmitter = require('events');
const path = require('path');

class OSProcessFactory extends EventEmitter {

    constructor(cwd) {
        super();
        this.cwd = cwd;
    }

    executeCommand(command, subCwd = this.name) {

        let stdout = '', stderr = '';

        let osProcess = new OSProcess(path.resolve(this.cwd, subCwd));
        let systemProcess = osProcess.execute(command);

        systemProcess.stdout.on('data', (data) => {
            stdout += data;
            osProcess.emit('stdout', data);
        });

        systemProcess.stderr.on('data', (data) => {
            stderr += data;
            osProcess.emit('stderr', data);
        });

        systemProcess.on('close', exitCode => {
            osProcess.emit('close', {
                exitCode,
                pid: systemProcess.pid,
                stdout,
                stderr
            });
        });

        return osProcess;
    }

}

module.exports = OSProcessFactory;