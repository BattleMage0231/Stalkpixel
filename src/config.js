// read write files
const fs = require('fs');

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
        describe: 'Your API key',
    })
    .string('key')
    .alias('key', 'k')
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
    targets.push(...(JSON.parse(fs.readFileSync(`${DIR}/../targets.json`))['targets']))
}

if(parsed['key']) {
    config['apikey'] = parsed['key'];
} else {
    config['apikey'] = JSON.parse(fs.readFileSync(`${DIR}/../secrets.json`))['apikey'];
}

exports.config = config;
exports.targets = targets;
