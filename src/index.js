#!/usr/bin/env node

const {
    getConfig,
    editConfigFile,
} = require('./config.js');

// api requests
const requests = require('./requests.js');

// displaying statuses
const display = require('./display.js');

// cached uuids
const DIR = __dirname;
const path = require('path');
const fs = require('fs');
let cache = require('./data/cache.json');

// fetch all statuses in array of names
async function fetchAll(config, targets) {
    for (target of targets) {
        let status;
        try {
            let uuid = cache[target];
            if (uuid === undefined) {
                uuid = await requests.fetchUUID(target);
                if (uuid !== null && config['cache']) {
                    cache[target] = uuid;
                }
            }
            status = await requests.fetchStatus(uuid, config['apikey']);
        } catch (err) {}
        display.displayStatus(target, status);
    }
}

// executes the program
function run(config) {
    requests.setConfig(config);
    display.setConfig(config);
    if (config['uncache']) {
        for (let name of config['uncache']) {
            delete cache[name];
        }
    }
    if (config['msg']) {
        display.displayStartMessage();
    }
    new Promise(resolve => {
        // follow mode vs normal mode
        if (config['follow']) {
            console.log('Started following player. Press CTRL-C to exit.\n');
            fetchAll(config, config['targets']);
            setInterval(() => fetchAll(config, config['targets']), 5000);
        } else {
            fetchAll(config, config['targets']).then(resolve);
        }
    }).then(() => {
        // if exited without error
        if (config['msg']) {
            display.displayFinishMessage();
        }
    }).finally(() => {
        // write to cache with or without error
        if (config['cache'] || config['uncache']) {
            fs.writeFileSync(path.join(DIR, 'data', 'cache.json'), JSON.stringify(cache, null, 4));
        }
    });
}

// open config file in editor if needed
if(getConfig()['config']) {
    editConfigFile().then(() => run(getConfig()));
} else {
    run(getConfig());
}
