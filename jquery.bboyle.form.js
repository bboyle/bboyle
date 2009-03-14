// jquery.bboyle.form.js
// Form handling
// benboyle.id.au
// 2009-03-10T20:57:27+10:00 


// selectors
jQuery.extend(jQuery.expr[':'], {
	// (in)valid controls
	invalid: function(e) {
		return jQuery(e).hasClass('invalid');
	},
	valid: function(e) {
		return jQuery(e).hasClass('valid');
	},
	// required
	required: function(e) {
		return jQuery(e).hasClass('required');
	}
});




var FORM_DEBUG = true;
var FORM_SUBMIT_TOLERANCE = 2000; // ms

// form submission
$('form').submit(function() {
	var now = new Date().getTime();
	var form = jQuery(this);
	function cancel() {
		// shake button (negative feedback)
		form.addClass('submit');
		if (FORM_DEBUG) console.log("cancel submit");
		return false;
	}

	// suppress, if repeated submit within timeframe (milliseconds)
	if (form.data('submitted') && now - form.data('submitted') < FORM_SUBMIT_TOLERANCE) {
		if (FORM_DEBUG) console.log("multiple form submission detected: < " + FORM_SUBMIT_TOLERANCE + " ms since last submit");
		return cancel();
	}
	form.data('submitted', now);

	//1. validate any fields with validation status 'unknonwn'
	
	jQuery(':text', form).filter(':not(:valid, :invalid)').css('background', 'cyan');	//.validate();

	//5. display the error summary
	//6. scroll to the error summary

	if (jQuery(':invalid', form).length > 0) return cancel();

	// FALSE (while developing)
	if (FORM_DEBUG) return false;
	return true;
});

