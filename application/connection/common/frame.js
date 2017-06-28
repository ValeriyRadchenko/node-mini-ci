const EventEmitter = require('events');

class Frame extends EventEmitter {

    constructor() {
        super();
    }

    encode(command, payload) {

        if (typeof payload === 'object') {
            try {
                payload = JSON.stringify(payload);
            } catch (error) {
            }
        }

        let decodedPayload = '';
        if (payload) {
            decodedPayload = Buffer.from(payload.toString()).toString('base64');
        }

        return `${command}::${decodedPayload};`;
    }

    decode(frame) {
        let regExp = new RegExp('^(\\w+)::(.*)');
        frame = regExp.exec(frame);

        if (!frame) {
            return null;
        }

        let command = frame[1];

        let payload = null;

        if (frame[2]) {
            payload = Buffer.from(frame[2], 'base64').toString();

            try {
                payload = JSON.parse(payload);
            } catch (error) {
            }
        }

        return {command, payload};
    }

}

module.exports = Frame;