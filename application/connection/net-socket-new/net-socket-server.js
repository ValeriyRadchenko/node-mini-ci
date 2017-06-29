const net = require('net');
const { Frame } = require('../common');
const config = require('../../../config').connection.netSocketProtocol;

const PORT = config.port;

class NetSocketServer extends Frame {
    constructor() {
        super();
        this.server = new net.createServer(socket => {
            this.handshake(socket);
        });

        this.clients = {};

        this.startPromise = new Promise(resolve => {
            this.server.listen(PORT, resolve);
        });

    }

    sendToWorkers(command, payload) {
        let frame = this.encode(command, payload);

        for (let key in this.clients) {
            let socket = this.clients[key];

            if (socket.$$role === 'worker') {
                socket.write(frame);
            }
        }
    }

    sendToControllers(command, payload) {
        let frame = this.encode(command, payload);

        for (let key in this.clients) {
            let socket = this.clients[key];

            if (socket.$$role === 'controller') {
                socket.write(frame);
            }
        }
    }

    close() {
        this.server.close();
    }

    handshake(socket) {
        console.log('new connection');

        socket.once('data', data => {
            data = data.toString().split('::');
            let role = data[0];
            let pid = data[1];

            if (role !== 'worker' && role !== 'controller') {
                socket.destroy('');
                return false;
            }

            socket.on('data', data => {
                this.onData(data.toString(), socket.$$role);
            });

            socket.on('error', error => {
                console.log(error);
            });

            socket.on('close', () => {
                delete this.clients[socket.$$pid];
            });

            socket.$$role = role;
            socket.$$pid = pid;
            this.clients[pid] = socket;

        });

        socket.write('hello');
    }

    onData(frames, role) {
        for (let frame of frames.split(';')) {
            if (!frame) {
                continue;
            }

            let decodedFrame = this.decode(frame);

            if (!decodedFrame) {
                return;
            }

            if (role === 'controller') {
                this.sendToWorkers(decodedFrame.command, decodedFrame.payload);
            } else {
                this.sendToControllers(decodedFrame.command, decodedFrame.payload);
            }

            this.emit(decodedFrame.command, decodedFrame.payload);
            this.emit('$all.events', decodedFrame);
        }
    }

    onStarted() {
        return this.startPromise;
    }

}

module.exports = NetSocketServer;

