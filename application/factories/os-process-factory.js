const OSProcess = require('../entities/os-process');
const path = require('path');
const rootProtocol = require('../connection/root-protocol');

class OSProcessFactory {

    constructor(name, workingDirectory) {
        this.name = name;
        this.workingDirectory = path.resolve(workingDirectory);
        this.protocol = rootProtocol.getClientProtocol();

        this.processRegestry = {};
    }

    createProcess(command, subDirectory = this.name) {
        let osProcess = new OSProcess(command, path.resolve(this.workingDirectory, subDirectory));
        this.processRegestry[osProcess.pid] = osProcess;
        this.protocol.statistic('process.created', {pid: osProcess.pid, command});
        osProcess.on('exit', processData => {
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
        return Promise.all(Object.keys(this.processRegestry)
            .map(pid => {
                return this.processRegestry[pid].terminate();
            }));
    }

}

module.exports = OSProcessFactory;