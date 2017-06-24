const fs = require('fs');
const path = require('path');
const config = require('../../config');
const logger = require('../logger/logger');

let session = null;

exports.saveSession = function saveSession(data) {
    let session = Object.assign(data, {nodeCIHome: config.homeDir});
    fs.writeFileSync(config.sessionFilePath, JSON.stringify(session));
};

exports.getSession = function getSession() {

    if (session) {
        return session;
    }

    try {
        session = JSON.parse(fs.readFileSync(config.sessionFilePath));
    } catch (error) {
        logger.error(error);
    }

    return session;
};