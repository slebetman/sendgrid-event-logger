function tester (function_under_test) {
	var result = {
		logs: [],
		exit: false
	}
	var logger = console.log;
	console.log = function () {
		result.logs.push(Array.prototype.slice.call(arguments).join(' '));
	};
	var exit = process.exit;
	process.exit = function () {
		result.exit = true;
	}
	function_under_test();
	console.log = logger;
	process.exit = exit;
	
	return result;
}

module.exports = tester;
