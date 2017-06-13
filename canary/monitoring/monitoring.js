const pidusage = require('pidusage');
const util = require('util');
const CLIView = require('./cli-view');

const stat = util.promisify(pidusage.stat);

class Monitoring {

    constructor() {
        this.processRegestry = {};
        this.cliView = new CLIView(['pid', 'cpu', 'memory'], 20);
    }

    add(osProcess) {
        this.processRegestry[osProcess.pid] = osProcess;

        this.cliView.push([osProcess.pid, 0, 0]);

        osProcess.on('close', processData => {
            this.cliView.remove(processData.pid);
            pidusage.unmonitor(processData.pid);
            delete this.processRegestry[processData.pid];
        });

        if (Object.keys(this.processRegestry).length === 1) {
            this.monitor()
                .then()
                .catch(console.log);
        }
    }

    async monitor() {
        if (Object.keys(this.processRegestry).length < 1) {
            return false;
        }

        for (let pid in this.processRegestry) {
            let osProcessUsage = await stat(pid);
            osProcessUsage.memory = +(osProcessUsage.memory / 1024 / 1024).toFixed(2);
            osProcessUsage.cpu = +(osProcessUsage.cpu.toFixed(2));

            this.cliView.push([pid, osProcessUsage.cpu, osProcessUsage.memory + ' MB']);

        }

        setTimeout(async () => {
            await this.monitor();
        }, 300);
    }

}

let monitoring = new Monitoring();

module.exports = monitoring;