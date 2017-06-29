const NetSocketClient = require('../connection/net-socket-new/net-socket-client');

module.exports = function getJobsStatus() {
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
};