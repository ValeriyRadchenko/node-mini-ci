const net = require('net');
const NetSocketBase = require('./net-socket-base');
const config = require('../../../config').connection.netSocketProtocol;

const PORT = config.port;

class NetSocketClient extends NetSocketBase {

    constructor() {
        super();
        this.client = net.createConnection({port: PORT}, this._onConnected.bind(this));
        this.client.on('data', this._onData.bind(this));
    }

    _onConnected() {
    }

    _send(data) {
        this.client.write(data + config.jsonDelimiter);
    }

    end() {
        this.client.end();
    }

    destroy() {
        this.client.destroy();
    }
}

module.exports = NetSocketClient;