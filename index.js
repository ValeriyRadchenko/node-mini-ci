const commandLineArgs = require('command-line-args');
const { spawn, fork, exec } = require('child_process');
const { startServer } = require('./ci-server');
const fs = require('fs');
const path = require('path');
const optionDefinitions = [
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'daemon', alias: 'd', type: Boolean }
];

const options = commandLineArgs(optionDefinitions);

if (options.daemon) {

    let child = spawn('node',['ci-server.js'], {detached: true, stdio: 'ignore'});
    child.unref();

    let session = {
      pid: child.pid
    };

    fs.writeFileSync(path.resolve(__dirname, 'session.dat'), JSON.stringify(session));
    console.log(`Daemon process id is ${child.pid}`);

} else {
    startServer(options);
}
