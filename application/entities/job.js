class Job {

    constructor(osProcessFactory, params) {
        this.osProcessFactory = osProcessFactory;
        this.timerId = null;
        this.stopped = false;
        this.params = params;

        this.init()
            .then(() => {
                return this.tick();
            })
            .catch(error => {
               throw error;
            });

    }

    async init() {
    }

    async condition() {
    }

    async action() {
    }

    async tick() {

        if (await this.condition()) {
            await this.action();
        }

        if (this.stopped) {
            return false;
        }

        this.timerId = setTimeout(async () => {
            await this.tick();
        }, 3000);
    }

    stop() {
        this.stopped = true;
        clearTimeout(this.timerId);
        return this.osProcessFactory.terminate();
    }

}

module.exports = Job;
