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
        if(obj['key'] && obj['name']) {
            value['modes'][obj['key']] = obj['name'];
        }
        // if object contains modes inside it
        if(obj['modes']) {
            // recursively call setMode for every object
            for(let x of obj['modes']) {
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
        if(game['modes']) {
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

let config;

function setConfig(obj) {
    config = obj;
}

// display the starting message
function displayStartMessage() {
    console.log(`${format.WARNING_MSG}\n`);
}

// displays the finishing message
function displayFinishMessage() {
    console.log(format.FINISHED_MSG);
}
// formatss status of an online player
function displayOnlineStatus(name, session) {
    let status = [];
    // get game, mode, and map data
    let gameType = session['gameType'];
    let mode = session['mode'];
    let map = session['map'];
    // parse game data
    if(gameType in gameData) {
        // if game has modes
        if(mode in gameData[gameType]['modes']) {
            mode = gameData[gameType]['modes'][mode];
        }
        gameType = gameData[gameType]['name'];
    }
    // special messages
    if(gameType == 'Limbo') {
        status.push(`In ${gameType}`);
        return status;
    } else if(['Main Lobby', 'Tournament Hall', 'Replay Viewer'].includes(gameType)) {
        status.push(`In a ${gameType}`);
        return status;
    } else if(mode == 'Lobby') {
        status.push(`In a ${gameType} Lobby`);
        return status;
    } else {
        status.push(`Playing ${gameType}`);
    }
    if(mode) {
        if(gameType == 'SkyBlock') {
            status.push(`In ${mode}`);
        } else {
            status.push(`In mode ${mode}`);
        }
    }
    if(map) {
        status.push(`On map ${map}`);
    }
    return status
}

// displays status of one player
function displayStatus(name, status) {
    if(!status|| !status['success']) {
        if(!config['online-only']) {
            console.log(format.inColor(`An exception occured when checking ${name}'s status\n`, format.RED));
        }
        return;
    }
    session = status['session'];
    if(!session['online']) {
        if(!config['online-only']) {
            console.log(`${name} is ${format.NOT_ONLINE}\n`);
        }
        return;
    }
    console.log(`${name} is ${format.ONLINE}`);
    // display status
    for(let line of displayOnlineStatus(name, session)) {
        console.log(`${format.PAD}${line}`);
    }
    // JSON dump
    if(config['dump']) {
        console.log(`${format.PAD}JSON dump: ${JSON.stringify(session)}`);
    }
    console.log('\n');
}

exports.displayStatus = displayStatus;
exports.displayStartMessage = displayStartMessage;
exports.displayFinishMessage = displayFinishMessage;
exports.setConfig = setConfig;
