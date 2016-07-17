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
var configParser = require('./config');

function checkElasticConnection (es,callback) {
	es.indices.existsTemplate({
		name: 'sendgrid_template'
	},(err,exist)=>{
		if (err) {
			print(`
				ERROR: Cannot connect to elasticsearch
				
				Please check the settings in ${configParser.configPath}.
				Also, ensure that elasticsearch is running.
			`);
			process.exit();	
		}
		if (!exist) {
			print('Installing template..');
			var template = require('./elasticsearch-template.json');
			es.indices.putTemplate({
				name: 'sendgrid_template',
				body: template
			},(err)=>{
				if (err) {
					print('ERROR:' + err);	
				}
				else {
					callback();
				}
			});
		}
		else {
			callback();
		}
	});
}

module.exports = checkElasticConnection;