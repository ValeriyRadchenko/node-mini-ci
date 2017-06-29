const net = require('net');
const { Frame } = require('../common');
const config = require('../../../config').connection.netSocketProtocol;

const PORT = config.port;

class NetSocketClient extends Frame {

    constructor(role = 'worker') {
        super();

        this.role = role;

        this.client = net.createConnection({port: PORT}, () => {
            this.client.once('data', data => {
                this.handshake(data.toString());
            });
        });

    }

    send(command, payload) {
        let frame = this.encode(command, payload);
        this.client.write(frame);
    }

    end() {
        this.client.end();
    }

    destroy() {
        this.client.destroy();
    }

    handshake(data) {
        if (data === 'hello') {
            this.client.write(`${this.role}::${process.pid}`);
            this.client.on('data', data => {
                this.onData(data.toString());
            });
            this.emit('connected');
        }
    }

    onData(frames) {
        for (let frame of frames.split(';')) {
            if (!frame) {
                continue;
            }

            let decodedFrame = this.decode(frame);

            if (!decodedFrame) {
                return;
            }

            this.emit(decodedFrame.command, decodedFrame.payload);
            this.emit('$all.events', decodedFrame);
        }
    }

}

module.exports = NetSocketClient;

