const EventEmitter = require('events');
const { ProcessError } = require('../../errors');

class Job extends EventEmitter {

    constructor(osProcessFactory, params) {
        super();
        this.osProcessFactory = osProcessFactory;
        this.timerId = null;
        this.stopped = false;
        this.params = params;
        this.restarted = 0;

        this.init()
            .then(() => {
                return this.tick();
            })
            .catch(error => {
                this.emit('error', new ProcessError(error));
            });

    }

    async init() {
    }

    async condition() {
    }

    async action() {
    }

    async tick() {

        let isUpdated = false;

        try {
            isUpdated = await this.condition();
        } catch (error) {
            this.emit('error', new ProcessError(error));
        }

        if (isUpdated) {
            try {
                await this.action();
            } catch (error) {
                this.emit('error', new ProcessError(error));
            }
        }

        if (this.stopped) {
            return false;
        }

        this.timerId = setTimeout(async () => {
            await this.tick();
        }, this.params.schedule.interval);
    }

    stop() {
        this.stopped = true;
        clearTimeout(this.timerId);
        return this.osProcessFactory.terminate();
    }

    restart() {
        if (!this.stopped) {
            return false;
        }

        this.restarted++;
        this.stopped = false;

        this.init()
            .then(() => {
                return this.tick();
            })
            .catch(error => {
                this.emit('error', new ProcessError(error));
            });
    }

}

module.exports = Job;
