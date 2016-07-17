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

function toDate (timestamp) {
	var t = new Date(timestamp * 1000);
	return t.toISOString().split('T')[0].replace(/-/g,'.');
}

function processEvent (e) {
	e.date = toDate(+e.timestamp);
	return e;
}

function indexName (e) {
	return 'mail-' + e.date;
}

function processBulk(events) {
	var ret = [];
	var l=events.length;
	
	for (var i=0; i<l; i++) {
		var e = processEvent(events[i]);
		ret.push({
			index: {
				_index: indexName(e),
				_type: 'log'
			}
		});
		ret.push(e);
	}
	
	return ret;
}

module.exports = {
	toDate: toDate,
	processEvent: processEvent,
	indexName: indexName,
	processBulk: processBulk
};
