// api requests and endpoints

const https = require('https');

const MOJANG_ENDPOINT = 'https://api.mojang.com/users/profiles/minecraft/';
const HYPIXEL_ENDPOINT = 'https://api.hypixel.net/status?';

// returns a promise of GET data from a link
function fetch(link) {
    return new Promise((resolve, reject) => {
        let data = '';
        https.get(link, (res) => {
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (err) => {
            reject(err.message);
        });
    });
}

// fetch Minecraft's UUID from a player name
async function fetchUUID(name) {
    return JSON.parse(await fetch(MOJANG_ENDPOINT + name))['id'];
}

// get player's Hypixel status from UUID
async function fetchStatus(uuid, key) {
    return JSON.parse(await fetch(`${HYPIXEL_ENDPOINT}key=${key}&uuid=${uuid}`));
}

exports.MOJANG_ENDPOINT = MOJANG_ENDPOINT;
exports.HYPIXEL_ENDPOINT = HYPIXEL_ENDPOINT;

exports.fetch = fetch;
exports.fetchUUID = fetchUUID;
exports.fetchStatus = fetchStatus;
