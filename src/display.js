const format = require('./format.js');

const gameData = {};

function loadGameData() {
    // recursively load a JSON object describing the modes of a game
    // object is the JSON object, newObj is the output object
    function setMode(obj, newObj) {
        // if mode data exists, set it
        if(obj['key'] && obj['name']) {
            newObj['modes'][obj['key']] = obj['name'];
        }
        // if object contains more modes inside it
        if(obj['modes']) {
            // recursively call setMode for every child
            obj['modes'].forEach((mode) => {
                setMode(mode, newObj);
            })
        }
    }
    // load data from JSON file for every game
    require('./data/modes.json').forEach((game) => {
        const key = game['key'];
        const value = new Object();
        value['name'] = game['name']; // clean name
        value['modes'] = new Object();
        value['modes']['LOBBY'] = 'Lobby'; // game lobby
        if(game['modes']) {
            game['modes'].forEach((obj) => {
                setMode(obj, value);
            });
        }
        gameData[key] = value;
    });
};

loadGameData();

function formatOnlineStatus(session) {
    let status = [];
    let gameType = session['gameType'];
    let mode = session['mode'];
    let map = session['map'];
    // parse game data
    if(gameType in gameData) {
        if(mode in gameData[gameType]['modes']) {
            mode = gameData[gameType]['modes'][mode];
        }
        gameType = gameData[gameType]['name'];
    }
    // special messages
    if(gameType === 'Limbo') {
        status.push(`In ${gameType}`);
    } else if(['Main Lobby', 'Tournament Hall', 'Replay Viewer'].includes(gameType)) {
        status.push(`In a ${gameType}`);
    } else if(mode === 'Lobby') {
        status.push(`In a ${gameType} Lobby`);
    } else {
        status.push(`Playing ${gameType}`);
        if(mode) {
            if(gameType === 'SkyBlock') {
                status.push(`In ${mode}`);
            } else {
                status.push(`In mode ${mode}`);
            }
        }
        const NO_MAP = ['Build Battle', 'Housing'];
        if(map && !NO_MAP.includes(gameType)) {
            status.push(`On map ${map}`);
        }
    }
    return status;
}

function displayStatus(name, status, options = {}) {
    options = {
        'online-only': false,
        'dump': true,
        ...options
    };
    let session = status['session'];
    if(!session['online']) {
        if(!options['online-only']) {
            console.log(`${name} is ${format.OFFLINE}\n`);
        }
        return;
    }
    console.log(`${name} is ${format.ONLINE}`);
    formatOnlineStatus(session).forEach((line) => console.log(line)); // write each line
    if(options['dump']) {
        console.log(`JSON dump: ${JSON.stringify(session)}\n`);
    }
}

function displayError(name, error) {
    console.log(format.inColor(`An exception occured when checking ${name}'s status`, format.RED));
    console.log(`${error.toString()}\n`);
}

exports.displayStatus = displayStatus;
exports.displayError = displayError;
