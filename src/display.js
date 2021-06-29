// get directory contents
const fs = require('fs');
const path = require('path');

// script directory
const DIR = __dirname;

// formatting
const format = require('./format.js');

// online status formatting
let gameData = new Object();

function loadGameData() {
    // recursively load a JSON object describing the modes of a game
    // object is the JSON object, value is the output object
    function setMode(obj, value) {
        // if mode data exists, set it
        if (obj['key'] && obj['name']) {
            value['modes'][obj['key']] = obj['name'];
        }
        // if object contains modes inside it
        if (obj['modes']) {
            // recursively call setMode for every object
            for (let x of obj['modes']) {
                setMode(x, value);
            }
        }
    }
    // load data from JSON file for every game
    require('./data/modes.json').forEach((game) => {
        // key = id of game
        let key = game['key'];
        let value = new Object();
        // set game's clean name
        value['name'] = game['name'];
        // mode data is stored at modes[GAME]['modes']
        value['modes'] = new Object();
        value['modes']['LOBBY'] = 'Lobby';
        // if game contains modes
        if (game['modes']) {
            // set mode of every mode object
            game['modes'].forEach((obj) => {
                setMode(obj, value);
            });
            // lobby constant
        }
        gameData[key] = value;
    });
};

loadGameData();

// formats status of an online player
function displayOnlineStatus(name, session) {
    let status = [];
    // get game, mode, and map data
    let gameType = session['gameType'];
    let mode = session['mode'];
    let map = session['map'];
    // parse game data
    if (gameType in gameData) {
        // if game has modes
        if (mode in gameData[gameType]['modes']) {
            mode = gameData[gameType]['modes'][mode];
        }
        gameType = gameData[gameType]['name'];
    }
    // special messages
    if (gameType == 'Limbo') {
        status.push(`In ${gameType}`);
        return status;
    } else if (['Main Lobby', 'Tournament Hall', 'Replay Viewer'].includes(gameType)) {
        status.push(`In a ${gameType}`);
        return status;
    } else if (mode == 'Lobby') {
        status.push(`In a ${gameType} Lobby`);
        return status;
    } else {
        status.push(`Playing ${gameType}`);
    }
    if (mode) {
        if (gameType == 'SkyBlock') {
            status.push(`In ${mode}`);
        } else {
            status.push(`In mode ${mode}`);
        }
    }
    const NO_MAP = ['Build Battle', 'Housing'];
    if (map && !NO_MAP.includes(gameType)) {
        status.push(`On map ${map}`);
    }
    return status
}

// displays status of one player
function displayStatus(name, status, options={}) {
    options = {
        'online-only': false,
        'dump': true,
        ...options,
    };
    session = status['session'];
    if (!session['online']) {
        if (!options['online-only']) {
            console.log(`${name} is ${format.OFFLINE}\n`);
        }
        return;
    }
    console.log(`${name} is ${format.ONLINE}`);
    // display status
    for (let line of displayOnlineStatus(name, session)) {
        console.log(`${line}`);
    }
    // JSON dump
    if (options['dump']) {
        console.log(`JSON dump: ${JSON.stringify(session)}\n`);
    }
}

// display an error
function displayError(name, error) {
    console.log(format.inColor(`An exception occured when checking ${name}'s status`, format.RED));
    console.log(`${error.toString()}\n`);
}

exports.displayStatus = displayStatus;
exports.displayError = displayError;
