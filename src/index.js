// terminal configuration
const args = require('./config.js');
const config = args.config;
const targets = args.targets;

// api requests
const requests = require('./requests.js');

// displaying statuses
const display = require('./display.js');

// fetch all statuses in array of names
async function fetchAll(targets) {
    for(target of targets) {
        let status;
        try {
            status = await requests.fetchStatus(await requests.fetchUUID(target), config['apikey']);
        } catch(err) {}
        display.displayStatus(target, status);
    }
}

// executes the program
function run() {
    display.displayStartMessage();
    fetchAll(targets).then(display.displayFinishMessage);
}

run();
