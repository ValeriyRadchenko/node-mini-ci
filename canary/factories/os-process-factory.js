const OSProcess = require('../entities/os-process');
const path = require('path');
const monitoring = require('../monitoring/monitoring');

class OSProcessFactory {

    constructor(name, workingDirectory) {
        this.name = name;
        this.workingDirectory = path.resolve(workingDirectory);

        this.processRegestry = {};
    }

    createProcess(command, subDirectory = this.name) {
        let osProcess = new OSProcess(command, path.resolve(this.workingDirectory, subDirectory));
        this.processRegestry[osProcess.pid] = osProcess;

        osProcess.on('close', processData => {
            delete this.processRegestry[processData.pid];
        });

        return osProcess;
    }

    getRunProcess(pid) {
        if (typeof pid !== 'number') {
            throw new Error('pid must be a number');
        }

        return this.processRegestry[pid];
    }

    terminate() {
        Object.keys(this.processRegestry)
            .forEach(pid => {
                this.processRegestry[pid].terminate();
            });
    }

}

module.exports = OSProcessFactory;