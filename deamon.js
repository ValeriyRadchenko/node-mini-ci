const os = require('os');
const { spawn, fork, exec } = require('child_process');
const fs = require('fs');



   let child = spawn('node',['test.js'], {detached: true, stdio: 'ignore'});
    child.unref();
    console.log(child.pid);

