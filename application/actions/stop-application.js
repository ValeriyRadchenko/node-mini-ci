const os = require('os');
const { exec } = require('child_process');
const { getSession } = require('../session/session');

module.exports = function stopApplication() {
    return new Promise((resolve, reject) => {
        let pid = getSession().pid;

        if (os.platform() === 'win32') {
            exec(`taskkill /pid ${pid} /T /F`, error => {
                if (error) {
                    return reject(error);
                }

                resolve(pid);
            });
        } else {
            exec(`kill -9 ${pid}`, error => {
                if (error) {
                    return reject(error);
                }

                resolve(pid);
            });
        }
    });
};