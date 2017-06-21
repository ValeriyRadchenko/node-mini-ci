const net = require('net');
const NetSocketBase = require('./net-socket-base');
const config = require('../../../config').connection.netSocketProtocol;

const PORT = config.port;

class NetSocketServer extends NetSocketBase {

    constructor() {
        super();
        this.server = new net.createServer(this._onConnected.bind(this));

        this.server.listen(PORT, () => {

        });

        this.clients = [];
    }

    _onConnected(socket) {

        socket.on('end', () => {
            this.clients.splice(this.clients.indexOf(socket), 1);
        });

        socket.on('data', this._onData.bind(this));

        this.clients.push(socket);
    }

    _send(data) {
        for (let socket of this.clients) {
            socket.write(data + config.jsonDelimiter);
        }
    }

    close() {
        this.server.close();
    }

}

module.exports = NetSocketServer;