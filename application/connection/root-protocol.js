const NetSocketServer = require('./net-socket/net-socket-server');
const NetSocketClient = require('./net-socket/net-socket-client');

let server = null;
let client = null;

function getServerProtocol() {
    return server || (server = new NetSocketServer());
}

function getClientProtocol() {
    return client || (client = new NetSocketClient());
}

exports.getServerProtocol = getServerProtocol;
exports.getClientProtocol = getClientProtocol;