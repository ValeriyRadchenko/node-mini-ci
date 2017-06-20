const config = require('../../config');
const Monitoring = require('./monitoring');
let monitoring = null;

module.exports = function applyMonitoring(target, propertyKey) {

    if (!target || typeof target[propertyKey] !== 'function') {
        throw new Error('Wrong parameters');
    }

    monitoring = monitoring || new Monitoring();

    let savedProperty = target[propertyKey];

    target[propertyKey] = function(...args) {

        let result = savedProperty.apply(target, args);

        monitoring.add(result);

        return result;
    };

    return target;
};