const Job = require('../entities/job');
const logger = require('../logger/logger');

class GitJob extends Job {

    constructor(osProcessFactory, params) {
        super(osProcessFactory, params);
    }

    async init() {
        const { git } = this.params;

        try {
            await this.clone();
            logger.log(`${git.url} is cloned`);
        } catch (error) {
            await this.pull();
            logger.log(`${git.url} is pulled`);
        }

        return this.action();
    }

    async condition() {
        const {git} = this.params;

        logger.log('Checking repository...');

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

    }

    async action() {
        const {scripts} = this.params;

        if (!scripts || scripts.length < 1 || !scripts.map) {
            return false;
        }

        await this.pull();
        logger.log(`${git.url} is pulled`);


        for (let script of scripts) {
            logger.info('Action', script, 'is started');
            logger.log('Action', script, 'is started');

            await this.osProcessFactory
                .createProcess(script)
                .wait();

            logger.info('Action', script, 'is finished');
        }

    }

    async clone() {
        const { git } = this.params;

        let gitUrl = git.url;

        if (/\@/.test(git.url)) {
            gitUrl = gitUrl.split('@');
            gitUrl[0] += `:${git.password || ''}`;
            gitUrl = gitUrl.join('@');
        }

        return this.osProcessFactory.createProcess(
            `git clone ${gitUrl} ./${this.osProcessFactory.name}`,
            '.'
        )
            .wait();
    }

    async pull() {
        const { git } = this.params;
        return this.osProcessFactory.createProcess(
            `git pull ${git.remote} ${git.branch}`
        )
            .wait();
    }

}

module.exports = GitJob;