var DEBUG_MODE = true;

// from irama
debug = function (message) {
	if (DEBUG_MODE && typeof window.console != 'undefined' && window.console.log != 'undefined') {
		window.console.log(message);
	}
};
