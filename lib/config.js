var fs;
var configPath = '/etc/sendgrid-event-logger.json';

// Defaults:
config = require('./default_config.json');

function init () {
	try {
		fs.writeFileSync(configPath,JSON.stringify(config,null,4));
		console.log(`
			A new config file has been installed at:
			
			${configPath}
			
			Please check the config and edit it if necessary.
		`.replace(/[\t ]+/g,' '));
	}
	catch (err) {
		console.log(`
			ERROR: Cannot install ${configPath}
			
			Please make sure you have correct permissions or are logged in as root.
		`.replace(/[\t ]+/g,' '));
	}
	
	process.exit();
}

function makeConf (fs_object) {
	if (!fs_object) {
		throw new Error('argument is not an object!');
	}
	fs = fs_object;
	
	if (!makeConf.called) {
		try {
			var txt = fs.readFileSync(configPath,'utf8');
			config = JSON.parse(txt);
		}
		catch (err) {
			if (err.code == 'ENOENT') {
				console.log('Cannot find config file.');
				init();
			}
			else {
				throw err;
			}
		}
	}
	makeConf.called = true;
	return config;
}

makeConf.called = false;
makeConf.init = init;

module.exports = makeConf;