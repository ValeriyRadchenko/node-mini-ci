const NetSocketClient = require('../connection/net-socket-new/net-socket-client');
const Table = require('cli-table');
const colors = require('colors');
const config = require('../../config');

function checkStatus() {
    return new Promise((resolve, reject) => {
        const client = new NetSocketClient('controller');
        let jobsStatus = {};

        client.once('error', reject);

        client.once('connected', () => {
            client.send('getStatus');
            setTimeout(() => {
                resolve(jobsStatus);
                client.end();
            }, 1000);
        });


        client.on('status', status => {
            jobsStatus[status.name] = status;
        });
    });
}

module.exports = function getJobsStatus() {

    return checkStatus()
        .then(jobsStatus => {
            let { showMonitoring } = config.monitoring;

            let head = ['Name', 'Type', 'pid', 'Status', 'Restarts', 'Start time']
                .map(item => item.cyan);

            if (showMonitoring) {
                head.push('CPU(avr)'.cyan);
                head.push('Memory(avr)'.cyan);
            }

            const table = new Table({
                head
            });

            for (let key in jobsStatus) {
                let status = jobsStatus[key];
                let array = [];

                for (let itemName in status) {

                    if (itemName === 'status') {
                        let value = status[itemName];
                        status[itemName] = (value === 'error') ? value.red : value.green;
                    }

                    array.push(status[itemName]);
                }

                array.splice(head.length, array.length);
                table.push(array);
            }

            console.log(table.toString());
        });
};