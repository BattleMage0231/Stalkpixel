// api requests and endpoints

const https = require('https');

const MOJANG_ENDPOINT = 'https://api.mojang.com/users/profiles/minecraft/';
const HYPIXEL_ENDPOINT = 'https://api.hypixel.net/status?';

let config;

function setConfig(obj) {
    config = obj;
}

// returns a promise of GET data from a link
function fetch(link) {
    return new Promise((resolve, reject) => {
        let data = '';
        https.get(link, (res) => {
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => resolve(data));
        }).on('error', (err) => {
            reject(err.message);
        });
    });
}

// wait for ms seconds
function pause(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// fetch Minecraft's UUID from a player name
async function fetchUUID(name) {
    res = JSON.parse(await fetch(MOJANG_ENDPOINT + name));
    if(res.error && res.error == 'TooManyRequestsException') {
        if(config['follow']) {
            console.log('Exceeded Mojang\'s API rate limit\n');
            return null;
        }
        if(!config['online-only']) {
            console.log('Exceeded Mojang\'s API rate limit, retrying every 10 seconds\n');
        }
    }
    while(res.error && res.error == 'TooManyRequestsException') {
        await pause(10000);
        res = JSON.parse(await fetch(MOJANG_ENDPOINT + name));
    }
    return res['id'];
}

// get player's Hypixel status from UUID
async function fetchStatus(uuid, key) {
    res = JSON.parse(await fetch(`${HYPIXEL_ENDPOINT}key=${key}&uuid=${uuid}`));
    if(res.throttle) {
        if(config['follow']) {
            console.log('Exceeded Hypixel\'s API rate limit\n');
            return null;
        }
        if(!config['online-only']) {
            console.log('Exceeded Hypixel\'s API rate limit, retrying every 10 seconds\n');
        }
    }
    while(res.throttle) {
        await pause(10000);
        res = JSON.parse(await fetch(`${HYPIXEL_ENDPOINT}key=${key}&uuid=${uuid}`));
    }
    return res;
}

exports.MOJANG_ENDPOINT = MOJANG_ENDPOINT;
exports.HYPIXEL_ENDPOINT = HYPIXEL_ENDPOINT;

exports.fetch = fetch;
exports.fetchUUID = fetchUUID;
exports.fetchStatus = fetchStatus;

exports.setConfig = setConfig;
