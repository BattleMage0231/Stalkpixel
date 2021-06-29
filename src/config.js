const path = require('path');

// open file in editor
const open = require('open');

// parse terminal arguments
const yargs = require('yargs');

const DIR = __dirname;

const parsed = yargs
    // config
    .option('config', {
        describe: 'Opens the configuration file in your text editor'
    })
    .boolean('config')
    // stalk command line list
    .option('stalk', {
        describe: 'Stalks the following list of players'
    })
    .array('stalk')
    .alias('stalk', 's')
    // alternate way to add api key
    .option('key', {
        describe: 'Externally provides an API key'
    })
    .string('key')
    .alias('key', 'k')
    // print online only
    .option('online-only', {
        describe: 'Only displays statuses of players that are online'
    })
    .boolean('online-only')
    .alias('online-only', 'o')
    // do not print JSON dumps
    .option('no-dump', {
        describe: 'Do not print JSON dumps for online players'
    })
    .boolean('no-dump')
    // cache player UUIDs
    .option('cache', {
        describe: 'Caches player UUIDs for less future API calls'
    })
    .boolean('cache')
    // edit UUID cache
    .option('edit-cache', {
        describe: 'Opens the UUID cache in your text editor'
    })
    .boolean('edit-cache')
    // follow a single player
    .option('follow', {
        describe: 'Continuously query a player every 10 seconds'
    })
    .string('follow')
    .alias('follow', 'f')
    // misc
    .alias('version', 'v')
    .help()
    .alias('help', 'h')
    .argv;

const configJSON = require('./../config/config.json');

// default values
const config = {
    'config': false,        // edit config file
    'stalk': false,         // stalk mode
    'apikey': '',           // api key
    'online-only': false,   // online only mode
    'dump': true,           // display JSON dumps
    'cache': false,         // cache data
    'edit-cache': false,    // edit cache
    'follow': false,        // follow mode
    'targets': [],          // targets
    ...configJSON
};

async function editConfigFile() {
    console.log('\nOpening the config file in your default editor...');
    await open(path.join(DIR, '..', 'config', 'config.json'));
}

async function editCacheFile() {
    console.log('\nOpening the UUID cache file in your default editor...');
    await open(path.join(DIR, 'data', 'cache.json'));
}

function setArgIfExists(arg, callback = () => {}, newArg = arg) {
    if(parsed[arg] !== undefined) {
        config[newArg] = parsed[arg];
        callback();
    }
}

// simple arguments
['online-only', 'dump', 'edit-cache', 'cache', 'config']
    .forEach(arg => setArgIfExists(arg));

setArgIfExists('key', () => {}, 'apikey');

// ['stalk'] in config is a boolean indicating whether the mode is stalk
setArgIfExists('stalk', () => {
    config['stalk'] = true;
}, 'targets');

setArgIfExists('follow', () => {
    // set target
    if(config['follow']) {
        config['targets'] = [parsed['follow']];
    }
});

// default to stalk mode
if(!config['stalk'] && !config['follow'] && !config['config'] && !config['edit-cache']) {
    config['stalk'] = true;
}

exports.config = config;
exports.editConfigFile = editConfigFile;
exports.editCacheFile = editCacheFile;
