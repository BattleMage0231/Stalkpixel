// formatting related classes and constants
const RED = '\033[91m';
const GREEN = '\033[92m';
const YELLOW = '\033[93m';
const END = '\033[0m';

function inColor(text, color) {
    return color + text + END;
}

const OFFLINE = inColor('Offline', RED);
const ONLINE = inColor('Online', GREEN);

const PAD = '  ';

exports.RED = RED;
exports.GREEN = GREEN;
exports.YELLOW = YELLOW;
exports.END = END;
exports.inColor = inColor;

exports.OFFLINE = OFFLINE;
exports.ONLINE = ONLINE;

exports.PAD = PAD;
