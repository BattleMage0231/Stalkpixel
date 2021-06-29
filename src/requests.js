// api requests and endpoints
const https = require('https');

const MOJANG_ENDPOINT = 'https://api.mojang.com/users/profiles/minecraft/';
const HYPIXEL_ENDPOINT = 'https://api.hypixel.net/status?';

// custom error types
class APIError extends Error {
    constructor(message) {
        super(message);
        this.name = "APIError";
    }
}

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
            reject(new APIError(err.message));
        });
    });
}

// fetch Minecraft's UUID from a player name
// returns null if the rate limit has been exceeded
async function fetchUUID(name) {
    let res = await fetch(MOJANG_ENDPOINT + name);
    // mojang returns an empty string if the username doesn't exist
    if(res == '') {
        throw new APIError(`The username ${name} doesn't exist in the Mojang API`);
    }
    res = JSON.parse(res);
    // error occured
    if(res.error) {
        // rate limit error
        if(res.error == 'TooManyRequestsException') {
            if(config['follow']) {
                console.log('Exceeded Mojang\'s API rate limit\n');
            }
            return null;
        }
        // other API errors
        throw new APIError(res.error);
    }
    // return uuid
    return res['id'];
}

// get player's Hypixel status from UUID
// returns null if the request exceeds the API rate limit
async function fetchStatus(uuid, key) {
    let res = await fetch(`${HYPIXEL_ENDPOINT}key=${key}&uuid=${uuid}`);
    res = JSON.parse(res); // this line will throw an error for 502 bad gateway, which returns HTML
    // too many requests sent
    if(res.throttle) {
        if(config['follow']) {
            console.log('Exceeded Hypixel\'s API rate limit\n');
        }
        return null;
    }
    // invalid api key
    if(res.success === false) {
        throw new APIError(res.cause);
    }
    return res;
}

exports.MOJANG_ENDPOINT = MOJANG_ENDPOINT;
exports.HYPIXEL_ENDPOINT = HYPIXEL_ENDPOINT;

exports.APIError = APIError;

exports.fetch = fetch;
exports.fetchUUID = fetchUUID;
exports.fetchStatus = fetchStatus;

exports.setConfig = setConfig;
