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

// Handle internal server error
function error500 (res,detail) {
	console.log('Error:',JSON.stringify(detail));
	
	var errdata = {
		status: "error",
		error: 500
	};
	if (detail) {
		errdata.detail = detail;
	}
	res.status(500);
	res.end(JSON.stringify(errdata));
}

module.exports = error500;