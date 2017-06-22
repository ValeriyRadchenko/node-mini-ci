class ProtocolError {
    constructor(error) {
        this.type = 'error';
        this.error = error;
    }
}

module.exports = ProtocolError;