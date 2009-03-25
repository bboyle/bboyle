var DEBUG_MODE = true;

// from irama
debug = function (message) {
	if (DEBUG_MODE && typeof window.console != 'undefined' && typeof window.console.log != 'undefined') {
		window.console.log(message);
	}
};

/**
 * Add document.activeElement support to browsers that don't support it.
 * @see http://www.jamesgoodfellow.com/blog/post/documentactiveElement-in-Firefox---Finding-The-Element-That-Has-Focus.aspx
 */
if (typeof document.activeElement == 'undefined' && document.addEventListener) {
	document.addEventListener("focus", function(e){
		if (e && e.target) {
			document.activeElement = e.target == document ? null : e.target;
		}
	}, true);
}