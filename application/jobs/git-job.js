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

            try {
                await this.pull();
                logger.log(`${git.url} is pulled`);
            } catch (error) {
                logger.error('Git', error);
            }

        }

        await this.action();

        let osProcess = this.osProcessFactory.createProcess('npm i');

        osProcess.on('data', logger.log);

        return osProcess
            .wait();
    }

    async condition() {
        const { git } = this.params;

        logger.log('Checking repository...');

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
            logger.error('Git', error);
            return false;
        }
    }

    async action() {
        const { scripts } = this.params;

        if (!scripts || scripts.length < 1) {
            return false;
        }

        try {
            await this.pull();
            logger.log(`${git.url} is pulled`);
        } catch (error) {
            logger.error('Git', error);
        }

        if (typeof scripts === 'string') {
            logger.warning('DeprecationWarning: Scripts as string are deprecated and will be removed from beta');
            return this.osProcessFactory
                .createProcess(scripts)
                .wait();
        }

        for (let script of scripts) {
            logger.info('Action', script, 'is started');
            logger.log('Action', script, 'is started');

            try {
                await this.osProcessFactory
                    .createProcess(script)
                    .wait();

                logger.info('Action', script, 'is finished');
            } catch (error) {
                logger.error('Script', error);
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