const NetSocketClient = require('./application/connection/net-socket-new/net-socket-client');
const readline = require('readline');

let client = new NetSocketClient();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
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

input();