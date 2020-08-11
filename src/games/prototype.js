const GAME = 'Prototype';
const GAME_ID = 'PROTOTYPE';

// capture the wool
function getCaptureTheWoolStatus(session) {
    const game = 'Capture the Wool';
    const map = session['map'];
    let status = [];
    status.push(`Playing ${game}`);
    status.push(`On map ${map}`);
    return status;
}

// tower wars
function getTowerWarsStatus(session) {
    const game = 'TowerWars';
    const map = session['map'];
    let status = [];
    status.push(`Playing ${game}`);
    status.push(`On map ${map}`);
    return status;
}

// some games are stored under the prototype lobby
const GAME_FROM_ID = {
    // capture the wool
    'PVP_CTW': getCaptureTheWoolStatus,
    // tower wars
    'TOWERWARS_SOLO': getTowerWarsStatus,
    'TOWERWARS_TEAM_OF_TWO': getTowerWarsStatus,
};

function getFormattedStatus(session) {
    let status = [];
    mode = session['mode'];
    map = session['map'];
    if(mode == 'LOBBY') {
        return [`In a ${GAME} lobby`];
    }
    if(mode in GAME_FROM_ID) {
        return GAME_FROM_ID[mode](session);
    }
    status.push(`Playing ${mode}`);
    status.push(`On map ${map}`);
    return status;
}

exports.GAME_ID = GAME_ID;
exports.getFormattedStatus = getFormattedStatus;
