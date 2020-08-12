// terminal configuration
const args = require('./config.js');
const config = args.config;
const targets = args.targets;

// api requests
const requests = require('./requests.js');
requests.setConfig(config);

// displaying statuses
const display = require('./display.js');
display.setConfig(config);

// cached uuids
const DIR = __dirname;
const path = require('path');
const fs = require('fs');
let cache = require('./data/cache.json');

// fetch all statuses in array of names
async function fetchAll(targets) {
    for(target of targets) {
        let status;
        try {
            let uuid =  cache[target];
            if(uuid === undefined) {
                uuid = await requests.fetchUUID(target);
                if(config['cache']) {
                    cache[target] = uuid;
                }
            }
            status = await requests.fetchStatus(uuid, config['apikey']);
        } catch(err) {}
        display.displayStatus(target, status);
    }
}

// executes the program
function run(config, targets) {
    if(config['uncache']) {
        for(let name of config['uncache']) {
            delete cache[name];
        }
    }
    if(config['msg']) {
        display.displayStartMessage();
    }
    fetchAll(targets).then(() => {
        if(config['msg']) {
            display.displayFinishMessage();
        }
        if(config['cache'] || config['uncache']) {
            fs.writeFileSync(path.join(DIR, 'data', 'cache.json'), JSON.stringify(cache));
        }
    });
}

if(require.main === module) {
    run(config, targets);
}