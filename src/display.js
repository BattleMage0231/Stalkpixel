// convert identifiers to readable statuses and displays them

// get directory contents
const fs = require('fs');

// script directory
const DIR = __dirname;

// formatting
const format = require('./format.js');
const Colors = format.Colors;
const Messages = format.Messages;
const PAD = format.PAD;

// online status formatting
const games = require('./games');

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
    for(line of games.getFormattedStatus(session)) {
        console.log(`${PAD}${line}`);
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
