function getFormattedStatus(session) {
    status = []; // array of lines
    let game = session['gameType'];
    let mode = session['mode'];
    let map = session['map'];
    // in a lobby
    if(mode == 'LOBBY') {
        status.push(`In a ${game} lobby`);
        return status;
    }
    // in a game
    status.push(`Playing ${game}`);
    if(mode != undefined) {
        status.push(`In mode ${mode}`);
    }
    if(map != undefined) {
        status.push(`On map ${map}`);
    }
    return status;
}

exports.GAME_ID = 'DEFAULT';
exports.getFormattedStatus = getFormattedStatus;
