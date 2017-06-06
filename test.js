const Job = require('./application/job');
const path = require('path');

let job = new Job('npm install', path.resolve('D:/romi'));
job.on('stdout', data => console.log(data));
job.runCommand('npm i')
    .then(data => {
        console.log(data.stdout);
    })
    .catch(error => console.log(error));

setTimeout(() => {
    job.stop();
}, 1000);
