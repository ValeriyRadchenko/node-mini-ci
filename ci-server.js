const fs = require('fs');
const path = require('path');
const util = require('util');

const stat = util.promisify(fs.stat);
const mkdir = util.promisify(fs.mkdir);
const readFile = util.promisify(fs.readFile);

const jobDir = path.resolve(__dirname, 'jobs');

let jobs = {};

async function onJobChanged(job) {
    jobs[job.name] = job;
}

async function onJobDirChange(eventType, filename) {
    console.log(eventType);
    if (!filename) return false;

    switch (eventType) {
        case 'change':
            try {
                let job = JSON.parse(await readFile(path.resolve(jobDir, filename)));
                await onJobChanged(job);
            }
            catch
                (error) {
                console.log(error);
            }

            break;
        default:
            return false;
    }
}

(async function () {

    try {
        await stat(jobDir);
    } catch (error) {
        await mkdir(jobDir);
    }

    fs.watch(jobDir, onJobDirChange);
})();

