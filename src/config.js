// read write files
const fs = require('fs');
// cross-platform paths
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
    // misc
    .alias('version', 'v')
    .help()
    .alias('help', 'h')
    .argv;

let config = new Object();
let targets = [];

if(parsed['stalk'] !== undefined) {
    targets = parsed['stalk'];
} else if(parsed['json'] !== undefined) {
    for(let file of parsed['json']) {
        try {
            targets.push(...(require(file)['targets']));
        } catch(err) {}
    }
} else {
    targets.push(...(require('./../config/targets.json')['targets']));
}

if(parsed['key']) {
    config['apikey'] = parsed['key'];
} else {
    config['apikey'] = require('./../config/secrets.json')['apikey'];
}

config['uncache'] = [];
if(parsed['uncache']) {
    config['uncache'] = parsed['uncache'];
}

config['online-only'] = (parsed['online-only'] === true);
config['msg'] = (parsed['msg'] === undefined);
config['dump'] = (parsed['dump'] === undefined);
config['cache'] = (parsed['cache'] === true);

exports.config = config;
exports.targets = targets;
