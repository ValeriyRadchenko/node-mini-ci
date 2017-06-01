const fs = require('fs');
const path = require('path');
const util = require('util');
const GitJob = require('./git-job');

const stat = util.promisify(fs.stat);
const mkdir = util.promisify(fs.mkdir);
const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

const jobDir = path.resolve(__dirname, 'jobs');

let jobs = {};
let runnedJobs = {};

function onJobChanged(job) {
    jobs[job.name] = job;
}

async function runJobs() {
    for (let key in jobs) {
        let job = jobs[key];

        if (!runnedJobs[job.name]) {
            let gitJob = new GitJob(job);
            await gitJob.start(10000);
            runnedJobs[job.name] = gitJob;
        }
    }
}

async function readJobFiles(jobFiles) {
    return await Promise.all(jobFiles.map(jobFileName => {
        return readFile(path.resolve(jobDir, jobFileName))
            .then(jobContent => {
                return JSON.parse(jobContent);
            })
            .catch(error => console.log('Cannot read and parse file', error));
    }));
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
            catch (error) {
                console.log(error);
            }

            break;
        default:
            return false;
    }
}

(async function () {

    let jobFiles = [];

    try {
        await stat(jobDir);
    } catch (error) {
        await mkdir(jobDir);
    }

    try {
        jobFiles = await readdir(jobDir);
    } catch (error) {
        jobFiles = [];
        console.log(error);
    }

    if (jobFiles.length > 0) {
        try {
            let oldJobs = await readJobFiles(jobFiles);
            oldJobs.forEach(job => {
                jobs[job.name] = job;
            });

            await runJobs();
        } catch (error) {
            console.log(error);
        }
    }

    // fs.watch(jobDir, onJobDirChange);
})();

