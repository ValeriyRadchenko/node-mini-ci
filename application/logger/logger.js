const fs = require('fs');
const path = require('path');
const config = require('../../config').logger;

const INFO = 'INFO';
const DEBUG = 'DEBUG';
const WARNING = 'WARNING';
const ERROR = 'ERROR';
const LOG = 'LOG';

const WEIGHT = {
    info: 0,
    debug: 1,
    warning: 2,
    error: 3,
    log: 99
};

const LOG_PATH = path.resolve(__dirname, '..', '..');

class Logger {

    constructor(streams = []) {
        this.streams = streams;
        this.weight = WEIGHT[config.level.toLowerCase()] || 0;
    }

    _apply(type, message) {
        if (this.weight > WEIGHT[type.toLowerCase()]) {
            return false;
        }

        let isoTime = new Date().toISOString();
        let logItem = `[${isoTime}](${type}) -- ${message.toString()}\n`;

        for (let stream of this.streams) {
            stream.write(logItem);
        }
    }

    info(message) {
        this._apply(INFO, message);
    }

    debug(message) {
        this._apply(DEBUG, message);
    }

    warning(message) {
        this._apply(WARNING, message);
    }

    error(message) {
        this._apply(ERROR, message);
    }

    log(message) {
        this._apply(LOG, message);
    }

}

const logger = new Logger([
    fs.createWriteStream(path.resolve(LOG_PATH, 'node-mini-ci.log'), {encoding: 'utf-8', flags: 'a'}),
    process.stdout
]);

module.exports = logger;