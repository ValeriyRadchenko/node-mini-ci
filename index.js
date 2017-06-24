const commandLineArgs = require('command-line-args');
const { startServer } = require('./ci-server');
const bootstrap = require('./application/bootstrap');
const checkEntryPoint = require('./application/actions/entry');

const optionDefinitions = [
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'debug', alias: 'd', type: Boolean },
    { name: 'add', alias: 'a', type: Boolean },
    { name: 'remove', alias: 'r', type: Boolean }
];

const options = commandLineArgs(optionDefinitions);

if (checkEntryPoint(options)) {
    return true;
}

if (options.debug) {
    startServer(options);
} else {
    bootstrap();
}
