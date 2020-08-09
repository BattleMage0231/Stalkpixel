const fs = require('fs');

// api requests
const requests = require('./requests.js');

// displaying statuses
const display = require('./display.js');

// file directory
const DIR = __dirname

// load files
const SECRETS = JSON.parse(fs.readFileSync(DIR + '/../secrets.json'));
const TARGETS = JSON.parse(fs.readFileSync(DIR + '/../targets.json'))['targets'];

// fetch all statuses in array of names
async function fetchAll(targets) {
    for(target of targets) {
        let status = await requests.fetchStatus(await requests.fetchUUID(target), SECRETS['apikey']);
        display.displayStatus(target, status);
    }
}

// executes the program
function run() {
    display.displayStartMessage();
    fetchAll(TARGETS).then(display.displayFinishMessage);
}

run();
