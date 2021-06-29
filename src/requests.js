const https = require('https');

const MOJANG_ENDPOINT = 'https://api.mojang.com/users/profiles/minecraft/';
const HYPIXEL_ENDPOINT = 'https://api.hypixel.net/status?';

class APIError extends Error {
    constructor(message) {
        super(message);
        this.name = 'APIError';
    }
}

// returns GET data
async function fetch(link) {
    return new Promise((resolve, reject) => {
        let data = '';
        https.get(link, (res) => {
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => resolve(data));
        }).on('error', (err) => {
            reject(new APIError(err.message));
        });
    });
}

// fetch Minecraft's UUID and username from a player name
// returns null if the rate limit has been exceeded
async function fetchData(name) {
    let res = await fetch(MOJANG_ENDPOINT + name);
    // empty string if the username doesn't exist
    if(res === '') {
        throw new APIError(`The username ${name} doesn't exist in the Mojang API`);
    }
    res = JSON.parse(res);
    if(res.error) {
        if(res.error === 'TooManyRequestsException') {
            return null;
        }
        throw new APIError(res.errorMessage);
    }
    return res;
}

// get player's Hypixel status from UUID
// returns null if the rate limit has been exceeded
async function fetchStatus(uuid, key) {
    let res = await fetch(`${HYPIXEL_ENDPOINT}key=${key}&uuid=${uuid}`);
    res = JSON.parse(res); // throws an error for bad gateway, which returns HTML
    // too many requests
    if(res.throttle) {
        return null;
    }
    if(res.success === false) {
        throw new APIError(res.cause);
    }
    return res;
}

exports.MOJANG_ENDPOINT = MOJANG_ENDPOINT;
exports.HYPIXEL_ENDPOINT = HYPIXEL_ENDPOINT;

exports.fetch = fetch;
exports.fetchData = fetchData;
exports.fetchStatus = fetchStatus;
