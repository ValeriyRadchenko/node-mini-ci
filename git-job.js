const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const util = require('util');

const stat = util.promisify(fs.stat);
const mkdir = util.promisify(fs.mkdir);

let rootDir = path.resolve(process.env.NODE_CI_HOME || '.', 'workspace');

class GitJob {

    constructor(job) {
        this.name = job.name;
        this.schedule = job.schedule;
        this.script = job.script;
        this.workingDirectory = job.workingDirectory;
        this.cwd = path.resolve(rootDir);
        this.git = job.git;
        this.processes = {};
        this.processBusy = false;
    }

    createProcess(command, pipeStdOut = false, subPath = this.name) {
        return new Promise((resolve, reject) => {
            let newProcess = exec(command, {cwd: path.resolve(this.cwd, subPath)}, (error, stdout, stderr) => {
                if (!error) {
                    resolve({stdout, stderr});
                } else {
                    reject(error);
                }
            });

            this.processes[newProcess.pid] = newProcess;

            newProcess.on('close', exitCode => {
                this.onProcessClose(exitCode, newProcess);
            });

            if (pipeStdOut) {
                newProcess.stdout.pipe(process.stdout);
                newProcess.stderr.pipe(process.stderr);
            }
        });
    }

    async check() {
        try {
            await this.createProcess('git remote update');

            let remoteResult = await this.createProcess(`git rev-parse ${this.git.remote}/${this.git.branch}`);
            let localResult = await this.createProcess('git rev-parse @');

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
        return this.createProcess(`git pull ${this.git.remote} ${this.git.branch}`);
    }

    async clone() {
        return this.createProcess(
            `git clone https://${this.git.credentials.username}:${this.git.credentials.password}@${this.git.url} ./${this.name}`, false, rootDir
        );
    }

    async executeScript() {

        if (!this.script) {
            return false;
        }

        if (typeof this.script === 'string') {
            return this.createProcess(this.script, true);
        } else {
            for (let script of this.script) {
                await this.createProcess(script, true);
            }
        }

    }

    async start() {

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

        this.intervalId = setInterval(async () => {

            if (this.processBusy) {
                console.log('process is busy');
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
        clearTimeout(this.intervalId);
        for (let key in this.processes) {
            this.processes[key].kill('SIGHUP');
        }
    }

    onProcessClose(exitCode, childProcess) {
        delete this.processes[childProcess.pid];
    }

}

module.exports = GitJob;