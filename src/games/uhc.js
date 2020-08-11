const GAME = 'UHC Champions';
const GAME_ID = 'UHC';

// note that speed UHC is different from UHC

const MODE_FROM_ID = {
    'BRAWL_DUO': 'Duo Brawl',
    'SOLO': 'Solo',
    'TEAMS': 'Teams',
};

function getFormattedStatus(session) {
    let status = [];
    let mode = session['mode'];
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
