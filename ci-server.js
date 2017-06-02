const fs = require('fs');
const path = require('path');
const util = require('util');
const GitJob = require('./git-job');
const DirectoryWatcher = require('./directory-watcher');

const stat = util.promisify(fs.stat);
const mkdir = util.promisify(fs.mkdir);
const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

const jobDir = (process.env.NODE_CI_HOME) ? path.resolve(process.env.NODE_CI_HOME, 'jobs') : path.resolve(__dirname, 'jobs');

let jobs = {};
let jobsThatRun = {};



async function runJobs() {
    for (let key in jobs) {
        let job = jobs[key];

        if (!jobsThatRun[job.fileName]) {
            let gitJob = new GitJob(job);
            jobsThatRun[job.fileName] = gitJob;
            await gitJob.start(10000);
        }
    }
}

async function onJobChanged(job) {
    console.log();
    if (!jobs[job.fileName]) {
        jobs[job.fileName] = job;

        // await runJobs();
    }
}

async function readJobFiles(jobFiles) {
    return await Promise.all(jobFiles.map(jobFileName => {
        return readFile(path.resolve(jobDir, jobFileName))
            .then(jobContent => {
                let job = JSON.parse(jobContent);
                job.fileName = jobFileName;
                return job;
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
                jobs[job.fileName] = job;
            });

            let watcher = new DirectoryWatcher(jobDir);

            watcher.on('new', (name) => {
                console.log('new', name);
            });

            watcher.on('remove', async (name) => {
                console.log('STOP');
                try {
                    jobsThatRun[name].stop();
                } catch (error) {
                    console.log('Catched', error);
                    // console.log(`Job ${jobsThatRun[name].name} has been removed`);
                }
                delete jobsThatRun[name];
            });

            await watcher.watch();

            console.log('Waiting new jobs...', jobDir);

            await runJobs();
        } catch (error) {
            console.log(error);
        }
    }



})();

