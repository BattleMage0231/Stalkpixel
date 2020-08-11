// main file in game module

const path = require('path'); // cross-platform paths

const DIR = __dirname;

let GAME_FROM_ID = new Map();

require('fs').readdirSync(`${DIR}`).forEach((file) => {
    if(file != 'index.js') {
        const obj = require(path.join(DIR, file));
        GAME_FROM_ID[obj.GAME_ID] = obj;
    }
});

function hasGame(gameId) {
    return gameId != 'DEFAULT' && gameId in GAME_FROM_ID;
}

function getFormattedStatus(session) {
    gameId = session['gameType'];
    if(hasGame(gameId)) {
        return GAME_FROM_ID[gameId].getFormattedStatus(session);
    }
    return GAME_FROM_ID['DEFAULT'].getFormattedStatus(session);
}

exports.hasGame = hasGame;
exports.getFormattedStatus = getFormattedStatus;