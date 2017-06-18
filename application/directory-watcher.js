const fs = require('fs');
const path = require('path');
const util = require('util');
const EventEmitter = require('events');
const config = require('../config').watcher;

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

const INTERVAL = (config.interval && config.interval > 3000) ? config.interval : 3000;

class DirectoryWatcher extends EventEmitter {

    constructor(dirPath) {
        super();

        this.dirPath = dirPath;
        this.intervalId = null;
        this.filesSnapshot = [];
    }

    async watch() {
        if (this.intervalId) {
            return false;
        }

        try {
            let stats = await stat(this.dirPath);

            if (!stats.isDirectory()) {
                throw new Error(`${this.dirPath} is not directory`);
            }

            // this.filesSnapshot = await readdir(this.dirPath);
        } catch (error) {
            console.log(error);
        }

        this.intervalId = setInterval(async () => {
            let files = await readdir(this.dirPath);

            for (let file of files) {
                if (this.filesSnapshot.indexOf(file) < 0) {
                    this.emit('new', file);
                }
            }

            for (let file of this.filesSnapshot) {
                if (files.indexOf(file) < 0) {
                    this.emit('remove', file);
                }
            }

            this.filesSnapshot = files;
        }, INTERVAL);
    }

    stopWatching() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

}

module.exports = DirectoryWatcher;
