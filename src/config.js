// read write files
const fs = require('fs');
const path = require('path');

// open file in editor
const open = require('open');

// dependency to parse terminal arguments
const yargs = require('yargs');

const DIR = __dirname;

const parsed = yargs
    // config
    .option('config', {
        describe: 'Opens the configuration file in a text editor',
    })
    .boolean('config')
    // stalk command line list
    .option('stalk', {
        describe: 'Stalks the following list of players',
    })
    .array('stalk')
    .alias('stalk', 's')
    // alternate way to add api key
    .option('key', {
        describe: 'Externally provides an API key',
    })
    .string('key')
    .alias('key', 'k')
    // print online only
    .option('online-only', {
        describe: 'Only displays statuses of players that are online',
    })
    .boolean('online-only')
    .alias('online-only', 'o')
    // print without start and end msg
    .option('no-msg', {
        describe: 'Do not print the start and finishing messages',
    })
    .boolean('no-msg')
    // do not print JSON dumps
    .option('no-dump', {
        describe: 'Do not print JSON dumps for online players',
    })
    .boolean('no-dump')
    // cache player UUIDs
    .option('cache', {
        describe: 'Caches player UUIDs for less future API calls',
    })
    .boolean('cache')
    // uncache player UUIDs
    .option('uncache', {
        describe: 'Uncaches the following list of names',
    })
    .array('uncache')
    // follow a single player
    .option('follow', {
        describe: 'Continuously query a player every 10 seconds',
    })
    .string('follow')
    .alias('follow', 'f')
    // misc
    .alias('version', 'v')
    .help()
    .alias('help', 'h')
    .argv;

// config file
let configJSON = require('./../config/config.json');

// default values
let config = {
    'config': false,
    'stalk': false,
    'apikey': '',
    'online-only': false,
    'msg': true,
    'dump': true,
    'cache': false,
    'uncache': [],
    'follow': false,
    'targets': [],
    ...configJSON,
};

function getConfig() {
    return config;
}

// open config.json in default editor and wait for it to close
async function editConfigFile() {
    console.log('Waiting for your editor to close the config file...\n');
    // open file in editor
    await open(
        path.join(DIR, '..', 'config', 'config.json'),
        {'wait': true} // wait for file to be closed
    );
}

// set config argument from parsed if exists
function setArgIfExists(arg, callback = () => {}, newArg = arg) {
    if(parsed[arg] !== undefined) {
        config[newArg] = parsed[arg];
        callback(); // run callback function
    }
}

// simple arguments which can simply be set by calling
// setArgIfExists without any callbacks
[
    'online-only',  // online only mode
    'msg',          // display starting and finishing messages
    'dump',         // display JSON dumps
    'uncache',      // uncache players
    'cache',        // cache data
    'config',       // edit config file
].map(arg => setArgIfExists(arg));

// api key as argument
setArgIfExists('key', () => {}, 'apikey');

// list of targets in normal mode
setArgIfExists('stalk', () => {
    config['stalk'] = true;
}, 'targets');

// follow mode
setArgIfExists('follow', () => {
    // set target of follow if it is the mode
    if(config['follow']) {
        config['targets'] = [parsed['follow']];
    }
});

exports.getConfig = getConfig;
exports.editConfigFile = editConfigFile;
