// formatting related classes and constants

const RED = '\033[91m';
const GREEN = '\033[92m';
const YELLOW = '\033[93m';
const END = '\033[0m';

function inColor(text, color) {
    return color + text + END;
}

const NOT_ONLINE = inColor('Not Online', RED);
const ONLINE = inColor('Online', GREEN);
const WARNING_MSG = inColor(
    'This API function can be disabled in game, so some offline players may actually be online', 
    YELLOW
);
const FINISHED_MSG = inColor('Finished fetching statuses', YELLOW);

const PAD = '  ';

exports.RED = RED;
exports.GREEN = GREEN;
exports.YELLOW = YELLOW;
exports.END = END;
exports.inColor = inColor;

exports.NOT_ONLINE = NOT_ONLINE;
exports.ONLINE = ONLINE;
exports.WARNING_MSG = WARNING_MSG;
exports.FINISHED_MSG = FINISHED_MSG;

exports.PAD = PAD;
