const fs = require('fs');
const path = require('path');
const util = require('util');
const Job = require('./application/job');

const stat = util.promisify(fs.stat);
const mkdir = util.promisify(fs.mkdir);

let rootDir = path.resolve(process.env.NODE_CI_HOME || '.', 'workspace');

class GitJob extends Job {

    constructor(job) {
        super(job.name, path.resolve(rootDir));

        this.name = job.name;
        this.schedule = job.schedule;
        this.scripts = job.scripts;
        this.workingDirectory = job.workingDirectory;
        this.cwd = path.resolve(rootDir);
        this.git = job.git;
        this.processes = {};
        this.processBusy = false;
        this.stopped = false;
    }

    async check() {
        try {
            await this.runCommand('git remote update');

            let remoteResult = await this.runCommand(`git rev-parse ${this.git.remote}/${this.git.branch}`);
            let localResult = await this.runCommand('git rev-parse @');

            console.log('checking repository...');

            if (remoteResult.stdout !== localResult.stdout) {
                return true;
            }

            return false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async pull() {
        return this.runCommand(`git pull ${this.git.remote} ${this.git.branch}`);
    }

    async clone() {
        return this.runCommand(
            `git clone https://${this.git.credentials.username}:${this.git.credentials.password}@${this.git.url} ./${this.name}`, false, rootDir
        );
    }

    async executeScript() {

        if (!this.scripts || this.scripts.length < 1 || this.stopped) {
            return false;
        }

        if (typeof this.scripts === 'string') {
            return this.runCommand(this.scripts, true);
        } else {

            for (let script of this.scripts) {
                try {
                    console.log('SCRIPT', script);
                    if (!this.stopped) {
                        await this.runCommand(script, true);
                    }
                } catch (error) {
                    if (!this.stopped) {
                        console.log('Script error:', error);
                    }
                }
            }

        }

    }

    async start() {
        this.stopped = false;

        try {
            await stat(rootDir);
        } catch (error) {
            await mkdir(rootDir);
        }

        let projectDir = path.resolve(rootDir, this.name);

        try {
            await stat(projectDir);
        } catch (error) {
            await mkdir(projectDir);
            await this.clone();
            await this.executeScript();
        }

        if (this.stopped) {
            return false;
        }

        this.intervalId = setInterval(async () => {

            if (this.processBusy) {
                return false;
            }

            this.processBusy = true;

            if (await this.check()) {
                console.log('Repository has been updated');
                await this.pull();
                await this.executeScript();
            }

            this.processBusy = false;

        }, this.schedule.interval);

    }

    stop() {
        this.stopped = true;
        clearInterval(this.intervalId);
        super.stop();
        return true;
    }

}

module.exports = GitJob;


// createProcess(command, pipeStdOut = false, subPath = this.name) {
//
//     if (this.stopped) {
//         return false;
//     }
//
//     return new Promise((resolve, reject) => {
//         let newProcess = exec(command, {cwd: path.resolve(this.cwd, subPath), detached: true}, (error, stdout, stderr) => {
//             if (!error) {
//                 resolve({stdout, stderr});
//             } else {
//                 reject(error);
//             }
//         });
//
//         this.saveProcess(newProcess);
//
//         newProcess.on('close', exitCode => {
//             this.onProcessClose(exitCode, newProcess);
//         });
//
//         if (pipeStdOut) {
//             newProcess.stdout.pipe(process.stdout);
//             newProcess.stderr.pipe(process.stderr);
//         }
//     });
// }