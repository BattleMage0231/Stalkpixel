// read write files
const fs = require('fs');
const path = require('path');

// dependency to parse terminal arguments
const yargs = require('yargs');

const DIR = __dirname;

const parsed = yargs
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

let config = {};
let targets = [];

// config file
let configJSON = require('./../config/config.json');

// set config properties are not a part of the main program
if (['setapikey', 'settargets', 'cleartargets', 'addtargets'].some((prop) => parsed.hasOwnProperty(prop))) {
    if (parsed.hasOwnProperty('setapikey')) {
        configJSON['apikey'] = parsed['setapikey'];
    }
    if (parsed.hasOwnProperty('cleartargets')) {
        configJSON['targets'] = [];
    }
    if (parsed.hasOwnProperty('settargets')) {
        configJSON['targets'] = parsed['settargets'];
    }
    if (parsed.hasOwnProperty('addtargets')) {
        configJSON['targets'].push(...parsed['addtargets']);
    }
    // write to config.json
    fs.writeFileSync(path.join(DIR, '..', 'config', 'config.json'), JSON.stringify(configJSON, null, 4));
    process.exit(0);
}

// targets from --stalk, --json, or default
if (parsed['stalk'] !== undefined) {
    targets = parsed['stalk'];
} else if (parsed['json'] !== undefined) {
    for (let file of parsed['json']) {
        try {
            let target = JSON.parse(fs.readFileSync(file));
            targets.push(...(target['targets']));
        } catch (err) {}
    }
} else {
    targets.push(...(configJSON['targets']));
}

// location of api key
config['apikey'] = parsed['key'];
if (!config['apikey']) {
    config['apikey'] = configJSON['apikey'];
}

// players being uncached
config['uncache'] = [];
if (parsed['uncache']) {
    config['uncache'] = parsed['uncache'];
}

// boolean arguments
config['follow'] = parsed['follow'];
config['online-only'] = parsed['online-only'];
config['msg'] = parsed['msg'];
if (parsed['msg'] === undefined) {
    config['msg'] = true;
}
config['dump'] = parsed['dump'];
if (parsed['dump'] === undefined) {
    config['dump'] = true;
}
config['cache'] = parsed['cache'];

exports.config = config;
exports.targets = targets;
