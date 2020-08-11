const GAME = 'The Pit';
const GAME_ID = 'PIT';

function getFormattedStatus(session) {
    return [`Playing ${GAME}`];
}

exports.GAME_ID = GAME_ID;
exports.getFormattedStatus = getFormattedStatus;
