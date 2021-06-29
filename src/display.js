const chalk = require('chalk');

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
        status.push('In ' + chalk.yellowBright(gameType));
    } else if(['Main Lobby', 'Tournament Hall', 'Replay Viewer'].includes(gameType)) {
        status.push('In a ' + chalk.yellowBright(gameType));
    } else if(mode === 'Lobby') {
        status.push('In a ' + chalk.yellowBright(gameType) + ' Lobby');
    } else {
        status.push('Playing ' + chalk.yellowBright(gameType));
        if(mode) {
            if(gameType === 'SkyBlock') {
                status.push('In ' + chalk.yellowBright(mode));
            } else {
                status.push('In mode ' + chalk.yellowBright(mode));
            }
        }
        const NO_MAP = ['Build Battle', 'Housing'];
        if(map && !NO_MAP.includes(gameType)) {
            status.push('On map ' + chalk.yellowBright(map));
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
            console.log(chalk.yellowBright(name) + ' is ' + chalk.redBright('Offline') + '\n');
        }
        return;
    }
    console.log(chalk.yellowBright(name) + ' is ' + chalk.green('Online'));
    formatOnlineStatus(session).forEach((line) => console.log(line)); // write each line
    if(options['dump']) {
        console.log(`JSON dump: ${JSON.stringify(session)}\n`);
    }
}

function displayError(name, error) {
    console.log(chalk.red(`An exception occured when checking ${name}'s status`));
    console.log(`${error.toString()}\n`);
}

exports.displayStatus = displayStatus;
exports.displayError = displayError;
