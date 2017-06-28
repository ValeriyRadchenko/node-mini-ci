const net = require('net');
const { Frame } = require('../common');

class NetSocketClient extends Frame {

    constructor(role = 'worker') {
        super();

        this.role = role;

        this.client = net.createConnection({port: 9090}, () => {
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

    handshake(data) {
        if (data === 'hello') {
            this.client.write(`${this.role}::${process.pid}`);
            this.client.on('data', data => {
                this.onData(data.toString());
            });
        }
    }

    onData(frames) {
        for (let frame of frames.split(';')) {
            if (!frame) {
                continue;
            }

            let decodedFrame = this.decode(frame);
            this.emit(decodedFrame.command, decodedFrame.payload);
        }
    }

}

module.exports = NetSocketClient;

