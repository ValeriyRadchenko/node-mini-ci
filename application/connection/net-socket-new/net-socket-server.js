const net = require('net');
const { Frame } = require('../common');

class NetSocketServer extends Frame {
    constructor() {
        super();
        this.server = new net.createServer(socket => {
            this.handshake(socket);
        });

        this.clients = {};

        this.server.listen(9090);
    }

    send(command, payload) {
        let frame = this.encode(command, payload);

        for (let key in this.clients) {
            let socket = this.clients[key];

            if (socket.$$role === 'worker') {
                socket.write(frame);
            }
        }
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
                this.onData(data.toString());
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

    onData(frames) {
        for (let frame of frames.split(';')) {
            if (!frame) {
                continue;
            }

            let decodedFrame = this.decode(frame);
            this.send(decodedFrame.command, decodedFrame.payload);
            this.emit(decodedFrame.command, decodedFrame.payload);
            console.log('onData', decodedFrame);
        }
    }

}

module.exports = NetSocketServer;

