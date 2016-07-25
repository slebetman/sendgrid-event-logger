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

var p = require('./parser');
var error500 = require('./error500');

var c = 'Copyright (C) 2016 TrustedCompany.com';
var gpl =
`This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License version 2 as
published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
`;

var indexer = null;

function init (elasticsearch_client) {
	indexer = elasticsearch_client;
}

function logger (req,res) {
	try {
		var events = req.body;
		var bulkRequest = p.processBulk(events);
		
		indexer.bulk({
			type: 'log',
			body: bulkRequest
		}, function(error,response){
			if (error || response.errors) {
				if (response.items) {
					var error_items = response.items.filter(
						(x)=>{return x.create && x.create.error}
					);
					response.items = error_items;
				}
				error500(res,response);
			}
			else {
				statusOK(res);
			}
		});
	}
	catch (err) {
		error500(res,err.toString());
	}
}

function status (req,res) {
	statusOK(res);
}

function copyright (req,res) {
	res.end(JSON.stringify({
		copyright: c,
		license: gpl
	}));
}

function statusOK (res) {
	res.status(200);
	res.end(JSON.stringify({status:'ok'}));
}

module.exports = {
	init: init,
	logger: logger,
	status: status,
	copyright: copyright
};
