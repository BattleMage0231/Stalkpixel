// convert identifiers to readable statuses and displays them

// get directory contents
const fs = require('fs');
const path = require('path');

// script directory
const DIR = __dirname;

// formatting
const format = require('./format.js');
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
    console.log(`${format.WARNING_MSG}\n`);
}

// displays the finishing message
function displayFinishMessage() {
    console.log(format.FINISHED_MSG);
}

// displays status of one player
function displayStatus(name, status) {
    if(status == null || !status['success']) {
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
    // get game, mode, and map data
    let gameType = session['gameType'];
    let mode = session['mode'];
    let map = session['map'];
    if(gameType in modes) {
        if(mode in modes[gameType]['modes']) {
            mode = modes[gameType]['modes'][mode];
        }
        gameType = modes[gameType]['name'];
    }
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
