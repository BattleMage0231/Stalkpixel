const GAME = 'Bed Wars';
const GAME_ID = 'BEDWARS';

// get mode from id
// modes are in the form NUMTEAMS_NUMPERTEAM
const MODE_FROM_ID = {
    'EIGHT_ONE': 'Solo',
    'EIGHT_TWO': 'Doubles',
    'FOUR_THREE': '3v3v3v3',
    'FOUR_FOUR': '4v4v4v4',
    'TWO_FOUR': '4v4',
    'EIGHT_TWO_VOIDLESS': 'Voidless Doubles',
    'FOUR_FOUR_VOIDLESS': 'Voidless 4v4v4v4',
};

function getFormattedStatus(session) {
    status = [];
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
