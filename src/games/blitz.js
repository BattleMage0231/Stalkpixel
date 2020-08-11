const GAME = 'Blitz SG';
const GAME_ID = 'SURVIVAL_GAMES';

const MODE_FROM_ID = {
    'solo_normal': 'Solo Normal',
    'teams_normal': 'Teams Normal',
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
    status.push(`On map ${map}`);
    return status;
}

exports.GAME_ID = GAME_ID;
exports.getFormattedStatus = getFormattedStatus;
