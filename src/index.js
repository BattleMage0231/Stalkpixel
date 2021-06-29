#!/usr/bin/env node

const { config, editConfigFile, editCacheFile } = require('./config.js');

const requests = require('./requests.js');
const display = require('./display.js');

// cached uuids
const DIR = __dirname;
const path = require('path');
const fs = require('fs');
const cache = require('./data/cache.json');

// returns null or an error if unsuccessful
async function getStatus(config, target) {
    let cacheKey = target.trim().toUpperCase(); // find cache key
    let status = null;
    let uuid, username;
    if(cache[cacheKey]) {
        uuid = cache[cacheKey]['uuid'];
        username = cache[cacheKey]['name'];
    }
    if(uuid === undefined || username === undefined) {
        let data = await requests.fetchData(target);
        if(data == null && config['follow']) {
            // don't retry if follow mode
            return null;
        }
        // while rate limit exceeded
        while(data == null) {
            // wait 10 seconds
            await new Promise(resolve => setTimeout(resolve, 10000));
            data = await requests.fetchData(target);
        }
        uuid = data['id'];
        username = data['name'];
        // cache uuid
        if(config['cache']) {
            cache[cacheKey] = {
                'name': username,
                'uuid': uuid
            };
        }
    }
    // get hypixel status information
    status = await requests.fetchStatus(uuid, config['apikey']);
    if(uuid == null && config['follow']) {
        return null;
    }
    // rate limit exceeded
    while(status == null) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10 seconds
        status = await requests.fetchStatus(uuid, config['apikey']);
    }
    return {
        'session': status['session'],
        'name': username
    };
}

async function follow(config) {
    console.log();
    while(true) {
        let status = null;
        try {
            status = await getStatus(config, config['targets'][0]);
        } catch(err) {
            display.displayError(config['targets'][0], err);
        }
        if(status !== null) {
            display.displayStatus(status['name'], status, config);
        }
        await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds
    }
}

async function stalk(config) {
    let targets = config['targets'];
    const statuses = [];
    // push promises into to array without waiting for them
    for(let target of targets) {
        const promise = getStatus(config, target);
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
            display.displayStatus(status['name'], status, config);
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
    } else if(config['edit-cache']) {
        await editCacheFile();
    }
}

function run(config) {
    if(config['apikey'] === '' && !config['config'] && !config['edit-cache']) {
        console.log('An API key was not found. Please run this application with --config to supply your key.');
        return;
    }
    runMode(config).finally(() => {
        // write to cache with or without error
        if (config['cache']) {
            fs.writeFileSync(path.join(DIR, 'data', 'cache.json'), JSON.stringify(cache, null, 4));
        }
    });
}

run(config);
