class Statistic {
    constructor(measure, payload) {
        this.type = 'statistic';
        this.measure = measure;
        this.payload = payload;
    }
}

module.exports = Statistic;