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




