const monitoring = require('./monitoring');
module.exports = function applyMonitoring(target, propertyKey) {

    if (!target || typeof target[propertyKey] !== 'function') {
        throw new Error('Wrong parameters');
    }

    let savedProperty = target[propertyKey];

    target[propertyKey] = function(...args) {

        let result = savedProperty.apply(target, args);

        monitoring.add(result);

        return result;
    };

    return target;
};