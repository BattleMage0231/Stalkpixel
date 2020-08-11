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
            targets.push(
                ...(JSON.parse(fs.readFileSync(file))['targets'])
            );
        } catch(err) {}
    }
} else {
    targets.push(...(JSON.parse(fs.readFileSync(path.join(DIR, '..', 'targets.json')))['targets']))
}

if(parsed['key']) {
    config['apikey'] = parsed['key'];
} else {
    config['apikey'] = JSON.parse(fs.readFileSync(path.join(DIR, '..', 'secrets.json')))['apikey'];
}

config['online-only'] = (parsed['online-only'] === true);
config['msg'] = (parsed['msg'] === undefined);
config['dump'] = (parsed['dump'] === undefined);

exports.config = config;
exports.targets = targets;
