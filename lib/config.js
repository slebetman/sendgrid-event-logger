/*
 * Copyright (C) 2016 TrustedCompany.com
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2 as
 * published bythe Free Software Foundation
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */
 
"use strict";

var print = require('./print');
var configPath = '/etc/sendgrid-event-logger.json';

// Defaults:
var config = require('./default_config.json');

function init (fs) {
	try {
		fs.writeFileSync(configPath,JSON.stringify(config,null,4));
		print(`
			A new config file has been installed at:
			
			${configPath}
			
			Please check the config and edit it if necessary.
		`);
	}
	catch (err) {
		print(`
			ERROR: Cannot install ${configPath}
			
			Please make sure you have correct permissions or are logged in as root.
		`);
		process.exit();
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
				print('ERROR: Cannot find config file.');
				print(`Please run:
				
					sudo sendgrid-event-logger install
						
					to install config file and elasticsearch template.
				`);
				
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
makeConf.configPath = configPath;

module.exports = makeConf;