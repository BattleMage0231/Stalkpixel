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

// gets the status of one player
// returns null or an error if unsuccessful
async function getStatus(config, target) {
    let status = null; // default status is null
    let uuid = cache[target]; // uuid already in cache
    // otherwise calculate it
    if (uuid === undefined) {
        uuid = await requests.fetchUUID(target);
        if(uuid == null && config['follow']) {
            // don't retry if follow mode
            console.log(`Exceeded Mojang\'s API rate limit\n`);
            return null;
        }
        // rate limit exceeded
        while(uuid == null) {
            // mojangLock is used to regulate the amount of cooldown notifications sent
            // this way, only one cooldown message is sent every 10 seconds
            if(!this.mojangLock) {
                this.mojangLock = true; // lock mojang cooldown
                console.log(`Exceeded Mojang\'s API rate limit, trying again soon...\n`);
                // set mojangLock to false in arrow function
                // because the arrow function modifies a property, bind it to this
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
    // don't retry if follow mode
    if(uuid == null && config['follow']) {
        console.log(`Exceeded Hypixel\'s API rate limit\n`);
        return null;
    }
    // rate limit exceeded
    while(status == null) {
        // same as mojangLock but for the Hypixel api
        if(!this.hypixelLock) {
            this.hypixelLock = true; // lock cooldown message
            console.log(`Exceeded Hypixel\'s API rate limit, trying again soon...\n`);
            setTimeout((() => this.hypixelLock = false).bind(this), 10000);
        }
        // wait 10 seconds
        await new Promise(resolve => setTimeout(resolve, 10000));
        // get status again
        status = await requests.fetchStatus(uuid, config['apikey']);
    }
    return status;
}

// set mojangLock and hypixelLock to default values
getStatus.mojangLock = false;
getStatus.hypixelLock = false;

// executes follow mode
async function follow(config) {
    console.log('\nStarted following player. Press CTRL-C to exit.\n');
    while(true) {
        let status = null;
        try {
            // await status
            status = await getStatus(config, config['targets'][0]);
        } catch(err) {
            // display error
            display.displayStatus(config['targets'][0], status);
        }
        // display status if it exists
        if(status !== null) {
            display.displayStatus(config['targets'][0], status);
        }
        await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5000ms
    }
}

// executes stalk mode
async function stalk(config) {
    // targets
    let targets = config['targets'];
    let statuses = [];
    // push promises into to array
    // these promises will execute asynchronously, reducing needed time greatly
    for(target of targets) {
        statuses.push(getStatus(config, target));
    }
    // display statuses
    console.log();
    for(let i = 0; i < statuses.length; ++i) {
        let status = null;
        try {
            // await the promise
            status = await statuses[i];
        } catch(err) {}
        // display promise and target
        display.displayStatus(targets[i], status);
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

// executes the program
function run(config) {
    requests.setConfig(config);
    display.setConfig(config);
    if (config['uncache']) {
        for (let name of config['uncache']) {
            delete cache[name];
        }
    }
    runMode(config).finally(() => {
        // write to cache with or without error
        if (config['cache'] || config['uncache']) {
            fs.writeFileSync(path.join(DIR, 'data', 'cache.json'), JSON.stringify(cache, null, 4));
        }
    });
}

run(getConfig());
