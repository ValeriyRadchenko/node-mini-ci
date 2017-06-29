const NetSocketClient = require('../connection/net-socket-new/net-socket-client');

module.exports = function stopApplication() {
    return new Promise((resolve, reject) => {
        const client = new NetSocketClient('controller');
        client.once('connected', () => {
            client.sendPrivileged('stop');
        });

        client.on('close', resolve);
        client.on('error', reject);
    });
};