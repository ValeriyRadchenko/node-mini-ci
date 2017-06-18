const EventEmitter  = require('events');
const { Command, Info, Statistic } = require('./index');

class IPC extends EventEmitter {

    constructor(osProcess = process) {
        super();
        this.osProcess = osProcess;

        osProcess.on('message', message => {
           if (typeof message !== 'object' && !message.type) {
               return false;
           }

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
           }
        });
    }

    command(command) {
        if (!command) {
            throw new Error('command is required');
        }

        this.osProcess.send && this.osProcess.send(new Command(command));
    }

    info(payload) {
        this.osProcess.send && this.osProcess.send(new Info(payload));
    }

    static(measure, payload) {
        if (!measure) {
            throw new Error('measure is required');
        }

        this.osProcess.send && this.osProcess.send(new Statistic(measure, payload));
    }

}

module.exports = IPC;