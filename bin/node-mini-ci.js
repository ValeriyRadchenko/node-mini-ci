#!/usr/bin/env node
const commandLineArgs = require('command-line-args');
const { spawn, fork, exec } = require('child_process');
const { startServer } = require('../ci-server');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const entryPointScript = path.resolve(projectRoot, 'ci-server.js');

const optionDefinitions = [
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'daemon', alias: 'd', type: Boolean }
];

const options = commandLineArgs(optionDefinitions);

if (options.daemon) {

    let child = spawn('node',[entryPointScript], {detached: true, stdio: 'ignore'});
    child.unref();
    console.log(`Daemon process id is ${child.pid}`);

} else {
    startServer(options);
}
