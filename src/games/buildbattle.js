const GAME = 'Build Battle';
const GAME_ID = 'BUILD_BATTLE';

const MODE_FROM_ID = {
    'SOLO_PRO': 'Pro',
    'SOLO_NORMAL': 'Solo',
    'TEAMS_NORMAL': 'Teams',
    'GUESS_THE_BUILD': 'Guess The Build',
};

function getFormattedStatus(session) {
    let status = [];
    let mode = session['mode'];
    let map = session['map'];
    if(mode == 'LOBBY') {
        status.push(`In a ${GAME} lobby`);
        return status;
    }
    status.push(`Playing ${GAME}`);
    if(mode in MODE_FROM_ID) {
        status.push(`In mode ${MODE_FROM_ID[mode]}`);
    } else {
        status.push(`In mode ${mode}`);
    }
    return status;
}

exports.GAME_ID = GAME_ID;
exports.getFormattedStatus = getFormattedStatus;
