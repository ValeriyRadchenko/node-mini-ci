const config = require('../../config').monitoring;
const pidusage = require('pidusage');
const util = require('util');
const helpers = require('./helpers');
const CLIView = require('./cli-view');

const stat = util.promisify(pidusage.stat);

class Monitoring {

    constructor(showMonitoring) {
        this.processRegistry = {};

        this.cliView = (showMonitoring) ?
            new CLIView(['pid', 'cpu', 'memory'], config.columnWidth) :
            null;

        this.memoryUnit = config.memoryUnit;
    }

    add(osProcess) {
        this.processRegistry[osProcess.pid] = osProcess;

        this.cliView && this.cliView.push([osProcess.pid, 0, 0]);

        osProcess.on('close', processData => {
            this.cliView && this.cliView.remove(processData.pid);
            pidusage.unmonitor(processData.pid);
            delete this.processRegistry[processData.pid];
        });

        if (Object.keys(this.processRegistry).length === 1) {
            this.monitor()
                .then()
                .catch(console.error);
        }
    }

    async monitor() {
        if (Object.keys(this.processRegistry).length < 1) {
            return false;
        }

        for (let pid in this.processRegistry) {
            let osProcessUsage = {cpu: 0, memory: 0};

            try {
                osProcessUsage = await stat(pid);
                osProcessUsage.memory = +(osProcessUsage.memory / helpers.getMemoryMeasure(this.memoryUnit)).toFixed(2);
                osProcessUsage.cpu = +(osProcessUsage.cpu.toFixed(2));

                this.cliView && this.cliView.push([
                    pid,
                    osProcessUsage.cpu,
                    `${osProcessUsage.memory} ${helpers.getShortBiteUnitName(this.memoryUnit)}`
                ]);
            } catch (error) {

            }

        }

        setTimeout(async () => {
            await this.monitor();
        }, config.updateDelay);
    }

}

module.exports = Monitoring;

