const Job = require('../entities/job');

class GitJob extends Job {

    constructor(osProcessFactory, params) {
        super(osProcessFactory, params);
    }

    async init() {
        let { git } = this.params;
        try {
            await this.clone();
        } catch (error) {

            try {
                await this.pull();
            } catch (error) {
                console.error(error);
            }

        }

        let osProcess = this.osProcessFactory.createProcess('npm i');

        osProcess.on('data', console.log);

        return osProcess
            .wait();
    }

    async condition() {
        console.log('condition');
        return true;
    }

    async action() {
        console.log('action');
    }

    async clone() {
        const { git } = this.params;
        return await this.osProcessFactory.createProcess(
            `git clone https://${git.credentials.username}:${git.credentials.password}@${git.url} ./${this.osProcessFactory.name}`,
            '.'
        )
            .wait();
    }

    async pull() {
        const { git } = this.params;
        return await this.osProcessFactory.createProcess(
            `git pull ${git.remote} ${git.branch}`
        )
            .wait();
    }

}

module.exports = GitJob;