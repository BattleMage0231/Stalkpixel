const GAME = 'SkyWars';
const GAME_ID = 'SKYWARS';

function getFormattedStatus(session) {
    status = []; // array of lines
    let mode = session['mode'];
    let map = session['map'];
    // in a skywars lobby
    if(mode == 'LOBBY') {
        status.push(`In a ${GAME} lobby`);
        return status;
    }
    // in a skywars game
    status.push(`Playing ${GAME}`);
    status.push(`In mode ${mode}`);
    status.push(`On map ${map}`);
    return status;
}

exports.GAME_ID = GAME_ID;
exports.getFormattedStatus = getFormattedStatus;
