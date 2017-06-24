class Command {
    constructor(command, payload) {
        this.type = 'command';
        this.command = command;
        this.payload = payload;
    }
}

module.exports = Command;