module.exports = {
    watcher: {
        interval: 5000, // milliseconds
        pattern: 'json' // job files ending
    },
    logger: {
        level: 'info', // info | debug | warning | error
    },
    monitoring: {
        showMonitoring: true,
        columnWidth: 20, // pixels
        updateDelay: 300, // milliseconds
        memoryUnit: 'megabyte' // byte | kilobyte | megabyte | gigabyte | terabyte
    }
};