const EventEmitter = require('events');
const config = require('../../../config').connection.netSocketProtocol;
const { Command, Info, Statistic, ProtocolError } = require('../common');

class NetSocketBase extends EventEmitter {
    constructor() {
        super();
    }

    _onConnected() {

    }

    _send(data) {

    }

    _onData(data) {
        data.toString().split(config.jsonDelimiter)
            .forEach(item => {

                if (!item) {
                    return false;
                }

                const message = JSON.parse(item);

                switch (message.type) {
                    case 'command':
                        this.emit(`command.${message.command}`, message);
                        break;
                    case 'info':
                        this.emit('info', message.payload);
                        break;
                    case  'statistic':
                        this.emit(`statistic.${message.measure}`, message.payload);
                        break;
                    case  'error':
                        this.emit(`protocol.error`, message.error);
                        break;
                }
            });
    }

    command(command) {
        if (!command) {
            throw new Error('command is required');
        }

        this._send(
            JSON.stringify(new Command(command))
        );
    }

    info(payload) {
        this._send(
            JSON.stringify(new Info(payload))
        );
    }

    statistic(measure, payload) {
        if (!measure) {
            throw new Error('measure is required');
        }

        this._send(
            JSON.stringify(new Statistic(measure, payload))
        );
    }

    error(error) {
        this._send(
            JSON.stringify(new ProtocolError(error))
        );
    }
}

module.exports = NetSocketBase;