const path = require('path');
const ConfigManager = require('../managers/config');
const {hastebinUpload} = require('../utils');
const packageJson = require('../../package.json');

const manager = new ConfigManager(null, path.join(__dirname, '..'));

const config = manager.load();

delete config.botToken;

let debugMessage = `SharpBot ${packageJson.version} Debug Output:

Config: ${JSON.stringify(config, null, 4)}
`;

const handleError = error => {
    console.log('We were unable to upload your debug information to HasteBin. Please copy & paste this output, or take a screenshot of it:');
    if (error) {
        debugMessage += 'Debug Error: ' + error.stack;
    }
    console.log('\n' + debugMessage);
    process.exit();
};

hastebinUpload(debugMessage)
    .then(({url}) => {
        if (url) {
            console.log('Here is the link to your debug output: ' + url);
        } else {
            handleError();
        }
        process.exit();
    })
    .catch(handleError);

