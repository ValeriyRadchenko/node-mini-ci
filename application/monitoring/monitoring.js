const config = require('../../config').monitoring;
const pidusage = require('pidusage');
const util = require('util');
const helpers = require('./helpers');
const { getClientProtocol } = require('../connection/root-protocol');
const logger = require('../logger/logger');

const stat = util.promisify(pidusage.stat);

class Monitoring {

    constructor() {
        this.processRegistry = {};
        this.protocol = getClientProtocol();
        this.memoryUnit = config.memoryUnit;
    }

    add(osProcess) {
        this.processRegistry[osProcess.pid] = osProcess;
        this.protocol.statistic('pidusage.push', [osProcess.pid, 0, 0]);

        osProcess.on('exit', processData => {
            this.protocol.statistic('pidusage.remove', processData.pid);
            pidusage.unmonitor(processData.pid);
            delete this.processRegistry[processData.pid];
        });

        if (Object.keys(this.processRegistry).length === 1) {
            this.monitor()
                .then()
                .catch(logger.error);
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

                this.protocol.statistic('pidusage.push', [
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

