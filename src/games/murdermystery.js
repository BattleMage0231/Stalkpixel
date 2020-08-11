const GAME = 'Murder Mystery';
const GAME_ID = 'MURDER_MYSTERY';

// modes are in the form MURDER_${mode}
const MODE_FROM_ID = {
    'MURDER_ASSASSINS': 'Assasins',
    'MURDER_CLASSIC': 'Classic',
    'MURDER_DOUBLE_UP': 'Double Up!',
    'MURDER_INFECTION': 'Infection',
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
