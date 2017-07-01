class BaseError extends Error {

    constructor(error) {
        super(error.message || error);

        if (error.message) {
            Object.keys(error).forEach(key => {
                this[key] = error[key];
            })
        }
    }

    toString() {
        let string = '';

        string += this.message + '\n';
        string += this.stack + '\n';

        Object.keys(this).forEach(key => {
            string += `${key}: ${this[key]}\n`;
        });

        return string;
    }
}

module.exports = BaseError;