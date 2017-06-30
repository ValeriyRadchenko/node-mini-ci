const KILOBYTE = 1024;

exports.getMemoryMeasure = unit => {
    switch (unit.toLowerCase()) {
        case 'byte':
            return 1;
        case 'kilobyte':
            return KILOBYTE;
        case 'megabyte':
            return Math.pow(KILOBYTE, 2);
        case 'gigabyte':
            return Math.pow(KILOBYTE, 3);
        case 'terabyte':
            return Math.pow(KILOBYTE, 4);
        default:
            // megabyte by default
            return Math.pow(KILOBYTE, 2);
    }
};

exports.getShortBiteUnitName = unit => {
    switch (unit.toLowerCase()) {
        case 'byte':
            return 'B';
        case 'kilobyte':
            return 'KB';
        case 'megabyte':
            return 'MB';
        case 'gigabyte':
            return 'GB';
        case 'terabyte':
            return 'TB';
        default:
            // megabyte by default
            return 'MB';
    }
};

exports.getRunTime = (startTime, endTime = Date.now()) => {
    let diff = endTime - startTime;

    if (diff < 1000) { // less then a second
        return 'Just now';
    }

    if (diff < 60000) { // less then a minute
        let seconds = Math.floor(diff / 1000);
        return `${seconds} ${(seconds !== 1) ? 'seconds' : 'second'} ago`;
    }

    if (diff < 60 * 60 * 1000) { // less then an hour
        let minutes = Math.floor(diff / 60000);
        return `${minutes} ${(minutes !== 1) ? 'minutes' : 'minute'} ago`;
    }

    if (diff < 24 * 60 * 60 * 1000) { // less then a day
        let hours = Math.floor(diff / (60 * 60 * 1000));
        return `${hours} ${(hours !== 1) ? 'hours' : 'hour'} ago`;
    }

    if (diff < 7 * 24 * 60 * 60 * 1000) { // less then a week
        let days = Math.floor(diff / (24 * 60 * 60 * 1000));
        return `${days} ${(days !== 1) ? 'days' : 'day'} ago`;
    }

    if (diff < 30 * 24 * 60 * 60 * 1000) { // less then a month
        let weeks = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
        return `${weeks} ${(weeks !== 1) ? 'weeks' : 'week'} ago`;
    }

    if (diff < 365 * 24 * 60 * 60 * 1000) { // less then a year
        let months = Math.floor(diff / (30 * 24 * 60 * 60 * 1000));
        return `${months} ${(months !== 1) ? 'months' : 'month'} ago`;
    }

    if (diff > 365 * 24 * 60 * 60 * 1000) { // more then a year
        let years = Math.floor(diff / (365 * 24 * 60 * 60 * 1000));
        return `${years} ${(years !== 1) ? 'years' : 'year'} ago`;
    }
};

const merge = (dist, src) => {

    for (let key in src) {

        if (typeof src[key] === 'object' && dist[key]) {
            merge(dist[key], src[key]);
            continue;
        }

        dist[key] = src[key];
    }

    return dist
};

const clone = (dist, src) => {
    for (let key in src) {

        if (typeof src[key] === 'object') {
            dist[key] = {};
            clone(src[key], dist[key]);
            continue;
        }

        dist[key] = src[key];
    }

    return dist;
};

exports.merge = merge;
exports.clone = clone;

