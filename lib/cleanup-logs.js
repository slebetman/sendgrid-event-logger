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

var async = require('async');

function makeCleaner (e,days_to_retain_log) {

	if (!days_to_retain_log) {
		console.log('Will never delete logs (is this really OK?)');
		return ()=>{};
	}
	
	console.log(`Will delete logs older than ${days_to_retain_log} days.`);

	var timeout = days_to_ms(days_to_retain_log);

	return function () {
		var now = new Date().valueOf();
		
		e.cat.indices({},(err,txt)=>{
			var indices = txt
				.split('\n')
				.map((x)=>{ return x.split(/\s+/)[2] })
				.filter((x)=>{ return x });
			
			var old_indices = indices.filter((x)=>{
				return (now - new Date(x).valueOf()) > timeout;
			});
			
			async.each(old_indices,function(index,callback){
				console.log(`Deleting index: ${index} ..`);
				e.indices.delete({
					index: index
				},(err,result)=>{
					callback();
				});
			},makeCleaner.testCallback);
		});
	};

};

function days_to_ms (n) {
	return n*24*60*60*1000;
};

makeCleaner.days = days_to_ms;
makeCleaner.testCallback = function(){};

module.exports = makeCleaner;