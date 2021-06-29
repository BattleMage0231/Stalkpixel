#!/usr/bin/env node

const {
    config,
    editConfigFile,
} = require('./config.js');

const requests = require('./requests.js');
const display = require('./display.js');

// cached uuids
const DIR = __dirname;
const path = require('path');
const fs = require('fs');
let cache = require('./data/cache.json');

// returns null or an error if unsuccessful
async function getStatus(config, target) {
    let status = null;
    let uuid = cache[target]; 
    if (uuid === undefined) {
        uuid = await requests.fetchUUID(target);
        if(uuid == null && config['follow']) {
            // don't retry if follow mode
            console.log(`Exceeded Mojang\'s API rate limit\n`);
            return null;
        }
        // rate limit exceeded
        while(uuid == null) {
            // regulate the amount of cooldown notifications sent (one every 10 seconds)
            if(!this.mojangLock) {
                this.mojangLock = true; // lock mojang cooldown
                console.log(`Exceeded Mojang\'s API rate limit, trying again soon...\n`);
                // mojangLock is a property of this function so bind it
                setTimeout((() => this.mojangLock = false).bind(this), 10000);
            }
            // wait 10 seconds
            await new Promise(resolve => setTimeout(resolve, 10000));
            // try again
            uuid = await requests.fetchUUID(target);
        }
        // cache uuid
        if (config['cache']) {
            cache[target] = uuid;
        }
    }
    // get hypixel status information
    status = await requests.fetchStatus(uuid, config['apikey']);
    if(uuid == null && config['follow']) {
        console.log(`Exceeded Hypixel\'s API rate limit\n`);
        return null;
    }
    // rate limit exceeded
    while(status == null) {
        if(!this.hypixelLock) {
            this.hypixelLock = true; // lock cooldown message
            console.log(`Exceeded Hypixel\'s API rate limit, trying again soon...\n`);
            setTimeout((() => this.hypixelLock = false).bind(this), 10000);
        }
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10 seconds
        status = await requests.fetchStatus(uuid, config['apikey']);
    }
    return status;
}

getStatus.mojangLock = false;
getStatus.hypixelLock = false;

async function follow(config) {
    console.log('\nStarted following player. Press CTRL-C to exit.\n');
    while(true) {
        let status = null;
        try {
            status = await getStatus(config, config['targets'][0]);
        } catch(err) {
            display.displayError(config['targets'][0], err);
        }
        if(status !== null) {
            display.displayStatus(config['targets'][0], status, config);
        }
        await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5000ms
    }
}

async function stalk(config) {
    let targets = config['targets'];
    let statuses = [];
    // push promises into to array without waiting for them
    for(target of targets) {
        let promise = getStatus(config, target);
        promise.catch(() => {}); // so that javascript doesn't complain about unhandled rejections
        statuses.push(promise);
    }
    console.log();
    for(let i = 0; i < statuses.length; ++i) {
        let status = null;
        try {
            // await the promise
            status = await statuses[i];
        } catch(err) {
            // display error
            display.displayError(targets[i], err);
        }
        if(status !== null) {
            display.displayStatus(targets[i], status, config);
        }
    }
}

async function runMode(config) {
    if(config['follow']) {
        await follow(config);
    } else if(config['stalk']) {
        await stalk(config);
    } else if(config['config']) {
        await editConfigFile();
    }
}

function run(config) {
    if (config['uncache']) {
        for (let name of config['uncache']) {
            delete cache[name];
        }
    }
    if(config['apikey'] === '' && !config['config']) {
        console.log('An API key was not found. Please run this application with --config to supply your key.');
        return;
    }
    runMode(config).finally(() => {
        // write to cache with or without error
        if (config['cache'] || config['uncache']) {
            fs.writeFileSync(path.join(DIR, 'data', 'cache.json'), JSON.stringify(cache, null, 4));
        }
    });
}

run(config);
