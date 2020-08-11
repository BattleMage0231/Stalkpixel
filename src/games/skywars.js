const GAME = 'SkyWars';
const GAME_ID = 'SKYWARS';

// get mode name from id
const MODE_FROM_ID = {
    'solo_normal': 'Solo Normal',
    'solo_insane': 'Solo Insane',
    'teams_normal': 'Teams Normal',
    'teams_insane': 'Teams Insane',
    'ranked_normal': 'Ranked',
    'mega_normal': 'Mega',
    'solo_insane_rush': 'Rush',
    'solo_insane_slime': 'Slime',
};

function getFormattedStatus(session) {
    let status = []; // array of lines
    let mode = session['mode'];
    let map = session['map'];
    // in a skywars lobby
    if(mode == 'LOBBY') {
        status.push(`In a ${GAME} lobby`);
        return status;
    }
    // in a skywars game
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
