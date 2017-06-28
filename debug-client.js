const NetSocketClient = require('./application/connection/net-socket-new/net-socket-client');
const readline = require('readline');

let client = null;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Who you are worker(0) or controller(1) ', (answer) => {
    if (answer === '0' || answer === 'worker') {
        client = new NetSocketClient('worker');
    } else if (answer === '1' || answer === 'controller') {
        client = new NetSocketClient('controller');
    } else {
        rl.close();
        return;
    }

    client.on('stop', () => {
        rl.close();
        client.end();
    });

    input();
});

function input() {
    rl.question('send command ', (answer) => {
        if (answer === ':q') {
            rl.close();
            client.end();
            return;
        }
        answer = answer.split(';');

        let command = answer[0];
        let payload = answer[1];
        client.send(command, payload);

        input();
    });
}

