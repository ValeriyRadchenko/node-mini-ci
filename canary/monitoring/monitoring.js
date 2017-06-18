const config = require('../../config');
const pidusage = require('pidusage');
const util = require('util');
const helpers = require('./helpers');
const CLIView = require('./cli-view');

const stat = util.promisify(pidusage.stat);

class Monitoring {

    constructor(showMonitoring) {
        this.processRegestry = {};

        this.cliView = (showMonitoring) ?
            new CLIView(['pid', 'cpu', 'memory'], config.monitoring.columnWidth) :
            null;

        this.memoryUnit = config.monitoring.memoryUnit;
    }

    add(osProcess) {
        this.processRegestry[osProcess.pid] = osProcess;

        this.cliView && this.cliView.push([osProcess.pid, 0, 0]);

        osProcess.on('close', processData => {
            this.cliView && this.cliView.remove(processData.pid);
            pidusage.unmonitor(processData.pid);
            delete this.processRegestry[processData.pid];
        });

        if (Object.keys(this.processRegestry).length === 1) {
            this.monitor()
                .then()
                .catch(console.error);
        }
    }

    async monitor() {
        if (Object.keys(this.processRegestry).length < 1) {
            return false;
        }

        for (let pid in this.processRegestry) {
            let osProcessUsage = await stat(pid);
            osProcessUsage.memory = +(osProcessUsage.memory / helpers.getMemoryMeasure(this.memoryUnit)).toFixed(2);
            osProcessUsage.cpu = +(osProcessUsage.cpu.toFixed(2));

            this.cliView && this.cliView.push([
                pid,
                osProcessUsage.cpu,
                `${osProcessUsage.memory} ${helpers.getShortBiteUnitName(this.memoryUnit)}`
            ]);

        }

        setTimeout(async () => {
            await this.monitor();
        }, config.monitoring.updateDelay);
    }

}

module.exports = Monitoring;

