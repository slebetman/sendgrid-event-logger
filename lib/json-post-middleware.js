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

var error500 = require('./error500');

function JSONpost (req,res,next){
	req.body = '';
	req.on('data',function(x){
		req.body += x.toString('utf8');
		if (req.body.length >= req.headers['content-length']) {
			try {
				req.body = JSON.parse(req.body);
				next();
			}
			catch (err) {
				error500(res,err.toString() + ' in JSON data');
			}
		}
	});
}

module.exports = JSONpost;
