const BaseError = require('./base-error');

exports.ProcessError = class ProcessError extends BaseError {
    constructor(error) {
        super(error);
    }
};