const Job = require('../entities/job');

class GitJob extends Job {

    constructor(osProcessFactory, params) {
        super(osProcessFactory, params);
    }

    async init() {
        const { git } = this.params;

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
        const { git } = this.params;

        console.log('checking repository...');

        try {
            await this.osProcessFactory
                .createProcess('git remote update')
                .wait();

            let remoteResult = await this.osProcessFactory
                .createProcess(`git rev-parse ${git.remote}/${git.branch}`)
                .wait();

            let localResult = await this.osProcessFactory
                .createProcess('git rev-parse @')
                .wait();

            if (remoteResult.stdout !== localResult.stdout) {
                return true;
            }

            return false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async action() {
        const { scripts } = this.params;

        if (!scripts || scripts.length < 1) {
            return false;
        }

        await this.pull();

        if (typeof scripts === 'string') {
            return this.osProcessFactory
                .createProcess(scripts)
                .wait();
        }

        for (let script of scripts) {
            try {
                await this.osProcessFactory
                    .createProcess(script)
                    .wait();
            } catch (error) {
                console.log('Script error:', error);
            }
        }

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