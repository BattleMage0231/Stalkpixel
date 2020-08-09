// convert identifiers to readable statuses and displays them

// formatting
const format = require('./format.js');
const Colors = format.Colors;
const Messages = format.Messages;
const PAD = format.PAD;

const nameOf = {
    'SKYWARS': 'SkyWars',
    'BEDWARS': 'Bed Wars',
    'HOUSING': 'Housing',
    'SKYBLOCK': 'SkyBlock'
};  

// display the starting message
function displayStartMessage() {
    console.log(`${Messages.WARNING_MSG}\n`);
}

// displays the finishing message
function displayFinishMessage() {
    console.log(Messages.FINISHED_MSG);
}

function getGameName(id) {
    let name = nameOf[id];
    return name == undefined ? id : name;
}

// displays status of one player given that they are online
function displayOnlineStatus(name, session) {
    let game = getGameName(session['gameType']); // get proper name of game
    // get other properties if they exist
    let mode = session['mode'];
    let map = session['map'];
    // player is in the main lobby
    if(game == 'MAIN') {
        console.log(`${PAD}In a Main Lobby`);
        return;
    }
    // player is in the lobby
    if(mode && mode == 'LOBBY') {
        console.log(`${PAD}In a ${game} Lobby`);
        return;
    }
    // regular online messages
    console.log(`${PAD}Playing ${game}`);
    if(mode) {
        console.log(`${PAD}In mode ${mode}`);
    }
    if(map) {
        console.log(`${PAD}On map ${map}`);
    }
}

// displays status of one player
function displayStatus(name, status) {
    if(status == null || !status['success']) {
        console.log(Colors.inColor(`An exception occured when checking ${name}'s status\n`, Colors.RED));
        return;
    }
    session = status['session'];
    if(!session['online']) {
        console.log(`${name} is ${Messages.NOT_ONLINE}\n`);
        return;
    }
    console.log(`${name} is ${Messages.ONLINE}`);
    displayOnlineStatus(name, session);
    console.log(`${PAD}JSON dump: ${JSON.stringify(session)}\n`);
}

exports.displayStatus = displayStatus;
exports.displayStartMessage = displayStartMessage;
exports.displayFinishMessage = displayFinishMessage;
