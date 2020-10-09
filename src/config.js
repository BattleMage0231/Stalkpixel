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
    // stalk json files
    .option('json', {
        describe: 'Stalks players in the given JSON files',
    })
    .array('json')
    .alias('json', 'j')
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
    // set api key
    .option('setapikey', {
        describe: 'Sets or updates your API key to the next argument',
    })
    .string('setapikey')
    // set targets
    .option('settargets', {
        describe: 'Sets the targets list to the following list',
    })
    .array('settargets')
    // clear targets
    .option('cleartargets', {
        describe: 'Clear the targets list'
    })
    .boolean('cleartargets')
    // add targets
    .option('addtargets', {
        describe: 'Adds targets to the list',
    })
    .array('addtargets')
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
    'json': false,
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
    // open file in editor
    await open(
        path.join(DIR, '..', 'config', 'config.json'),
        {'wait': true} // wait for file to be closed
    );
    // update configJSON
    configJSON = require('./../config/config.json');
    // no longer need to config
    config['config'] = false;
    // update apikey and targets
    if (!config['apikey']) {
        config['apikey'] = configJSON['apikey'];
    }
    if(config['targets'].length == 0) {
        config['targets'] = configJSON['targets'];
    }
}

// targets from --stalk or --json
if (parsed['stalk'] !== undefined) {
    config['targets'] = parsed['stalk'];
} else if (parsed['json'] !== undefined) {
    for (let file of parsed['json']) {
        try {
            let target = JSON.parse(fs.readFileSync(file));
            config['targets'].push(...(target['targets']));
        } catch (err) {}
    }
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

// follow mode
setArgIfExists('follow', () => {
    // set target of follow if it is the mode
    if(config['follow']) {
        config['targets'] = [parsed['follow']];
    }
});

exports.getConfig = getConfig;
exports.editConfigFile = editConfigFile;
