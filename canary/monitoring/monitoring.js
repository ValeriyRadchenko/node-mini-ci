const pidusage = require('pidusage');
const util = require('util');

const stat = util.promisify(pidusage.stat);

class Monitoring {

    constructor() {
        this.processRegestry = {};
    }

    add(osProcess) {
        this.processRegestry[osProcess.pid] = osProcess;

        osProcess.on('close', processData => {
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
            console.log(osProcessUsage);
        }

        setTimeout(async () => {
            await this.monitor();
        }, 1000);
    }

}

module.exports = Monitoring;