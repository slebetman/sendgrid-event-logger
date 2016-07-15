var configPath = '/etc/sendgrid-event-logger.json';

// Defaults:
config = require('./default_config.json');

function init (fs) {
	try {
		fs.writeFileSync(configPath,JSON.stringify(config,null,4));
		console.log(`
			A new config file has been installed at:
			
			${configPath}
			
			Please check the config and edit it if necessary.
		`.replace(/^[\t ]+/mg,''));
	}
	catch (err) {
		console.log(`
			ERROR: Cannot install ${configPath}
			
			Please make sure you have correct permissions or are logged in as root.
		`.replace(/^[\t ]+/mg,''));
	}
}

function makeConf (fs) {
	if (!fs) {
		throw new Error('argument is not an object!');
	}
	
	if (!makeConf.called) {
		try {
			var txt = fs.readFileSync(configPath,'utf8');
			config = JSON.parse(txt);
		}
		catch (err) {
			if (err.code == 'ENOENT') {
				console.log('ERROR: Cannot find config file.');
				console.log(`Please run:
				
							sudo sendgrid-event-logger install
								
							to install config file and elasticsearch template.
				`.replace(/^[\t ]+/mg,''));
				
				process.exit();
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