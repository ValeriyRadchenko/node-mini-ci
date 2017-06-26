const BaseError = require('./base-error');

class ProcessError extends BaseError {

    constructor(error) {
        super(error);
    }

}

module.exports = ProcessError;