const GAME = 'Housing';
const GAME_ID = 'HOUSING';

function getFormattedStatus(session) {
    if(session['mode'] == 'LOBBY') {
        return [`In a ${GAME} lobby`];
    }
    // session['map'] will always be 'Base' so it's irrelevant
    return [`Playing ${GAME}`];
}

exports.GAME_ID = GAME_ID;
exports.getFormattedStatus = getFormattedStatus;
