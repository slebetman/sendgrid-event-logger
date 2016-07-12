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
	res.setHeader('Content-Type', 'application/json');
	
	var events = req.body;
	var bulkRequest = p.processBulk(events);
	
	indexer.bulk({
		type: 'log',
		body: bulkRequest
	}, function(error,response){
		if (error || response.errors) {
			error500(res,response);
		}
		else {
			statusOK(res);
		}
	});
}

function status (req,res) {
	res.setHeader('Content-Type', 'application/json');
	statusOK(res);
}

function copyright (req,res) {
	res.setHeader('Content-Type', 'application/json');
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
