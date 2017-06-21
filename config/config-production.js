module.exports = {
    watcher: {
        interval: 5000, // milliseconds
        pattern: 'json' // job files ending
    },
    logger: {
        level: 'info', // info | debug | warning | error
        logFileName: 'node-mini-ci'
    },
    monitoring: {
        showMonitoring: true,
        columnWidth: 20, // pixels
        updateDelay: 300, // milliseconds
        memoryUnit: 'megabyte' // byte | kilobyte | megabyte | gigabyte | terabyte
    },
    connection: {
        netSocketProtocol: {
            port: 8147,
            jsonDelimiter: ';'
        }
    }
};