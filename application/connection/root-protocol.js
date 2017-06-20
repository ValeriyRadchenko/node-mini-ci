const IPC = require('./ipc/ipc');

let protocol = null;

function getProtocol(osProcess) {
    protocol = protocol || new IPC(osProcess);
    return protocol;
}

exports.getProtocol = getProtocol;