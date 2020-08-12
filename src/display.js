// convert identifiers to readable statuses and displays them

// get directory contents
const fs = require('fs');
const path = require('path');

// script directory
const DIR = __dirname;

// formatting
const format = require('./format.js');
const Colors = format.Colors;
const Messages = format.Messages;
const PAD = format.PAD;

// online status formatting
let modes = new Object();

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
        // if game contains modes
        if(game['modes']) {
            // mode data is stored at modes[GAME]['modes']
            value['modes'] = new Object();
            // set mode of every mode object
            game['modes'].forEach((obj) => {
                setMode(obj, value);
            });
            // lobby constant
            value['modes']['LOBBY'] = 'Lobby';
        }
        modes[key] = value;
    });
};

loadGameData();

let config;

function setConfig(obj) {
    config = obj;
}

// display the starting message
function displayStartMessage() {
    console.log(`${Messages.WARNING_MSG}\n`);
}

// displays the finishing message
function displayFinishMessage() {
    console.log(Messages.FINISHED_MSG);
}

// displays status of one player
function displayStatus(name, status) {
    if(status == null || !status['success']) {
        if(!config['online-only']) {
            console.log(Colors.inColor(`An exception occured when checking ${name}'s status\n`, Colors.RED));
        }
        return;
    }
    session = status['session'];
    if(!session['online']) {
        if(!config['online-only']) {
            console.log(`${name} is ${Messages.NOT_ONLINE}\n`);
        }
        return;
    }
    console.log(`${name} is ${Messages.ONLINE}`);
    // REMINDER TO MAKE THIS CLEANER
    let _gameType = session['gameType'];
    let _mode = session['mode'];
    let _map = session['map'];
    let gameType = (_gameType in modes) ? modes[_gameType]['name'] : _gameType;
    let mode = (_gameType in modes && modes[_gameType]['modes'] && _mode in modes[_gameType]['modes']) ? modes[_gameType]['modes'][_mode] : _mode;
    let map = _map;
    if(gameType == 'Limbo') {
        console.log(`${PAD}In ${gameType}`);
    } else if(['Main Lobby', 'Tournament Hall', 'Replay Viewer'].includes(gameType)) {
        console.log(`${PAD}In a ${gameType}`);
        mode = null;
        map = null;
    } else if(mode == 'Lobby') {
        console.log(`${PAD}In a ${gameType} Lobby`);
        mode = null;
        map = null;
    } else if(gameType == 'Prototype') {
        console.log(`${PAD}Playing ${mode}`);
        mode = null;
    } else {
        console.log(`${PAD}Playing ${gameType}`);
    }
    if(mode) {
        if(gameType == 'SkyBlock') {
            console.log(`${PAD}In ${mode}`);
        } else {
            console.log(`${PAD}In mode ${mode}`);
        }
    }
    if(map) {
        console.log(`${PAD}On map ${map}`);
    }
    if(config['dump']) {
        console.log(`${PAD}JSON dump: ${JSON.stringify(session)}`);
    }
    console.log('\n');
}

exports.displayStatus = displayStatus;
exports.displayStartMessage = displayStartMessage;
exports.displayFinishMessage = displayFinishMessage;
exports.setConfig = setConfig;
