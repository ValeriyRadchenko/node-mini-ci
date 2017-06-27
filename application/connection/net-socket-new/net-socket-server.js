const net = require('net');
const EventEmitter = require('events');

class NetSocketServer extends EventEmitter {
    constructor() {
        super();
        this.server = new net.createServer(socket => {
            this.handshake(socket);
        });

        this.clients = {
            workers: {},
            controllers: {}
        };

        this.server.listen(9090);
    }

    handshake(socket) {
        console.log('new connection');

        socket.once('data', data => {
            data = data.toString().split('::');
            let role = data[0];
            let pid = data[1];

            if (role === 'worker') {
                socket.on('data', data => {
                    this.onData(data.toString());
                });


                this.clients.workers[pid] = socket;
                return;
            }

            if (role === 'controller') {

                socket.on('data', data => {
                    this.onData(data.toString());
                });

                this.clients.controllers[pid] = socket;
                return;
            }


            socket.destroy('');
        });



        socket.write('hello');
    }

    onData(data) {
        console.log(this.clients);
        let eventRegExp = new RegExp('^(\w+)::([^\n]+)');

        let packeges = data.split('\n')
            .forEach(pack => {
                let result = eventRegExp.exec(pack);
                if (result && result.length > 2) {
                    this.emit({event: result[1], payload: result[2]});
                }
            });
    }

}

let protocol = new NetSocketServer();

protocol.once('handshake.init', type => {
    console.log('type', type);
});

// function handshake(socket) {
//     socket.on('data', data => {
//         if (data === 'worker') {
//             console.log('worker');
//             socket.write('your_pid');
//             return;
//         }
//
//         if (data === 'controller') {
//             console.log('controller');
//             return;
//         }
//
//         socket.destroy('Bad handshake');
//     });
//
//     socket.write('hello');
// }
