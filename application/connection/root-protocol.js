const IPC = require('./ipc/ipc');

function getProtocol(osProcess) {
    return new IPC(osProcess);
}

exports.getProtocol = getProtocol;