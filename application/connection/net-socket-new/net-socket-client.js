const net = require('net');

let client = net.createConnection({port: 9090}, () => {
    client.once('data', data => {
        handshake(data);
    });

    function handshake(data) {
        data = data.toString();
        console.log(data);
        if (data === 'hello') {
            client.write(`worker::${process.pid}`);
            client.write('command::{}');
        }
    }
});

