// jquery.bboyle.form.js
// Form handling
// bboyle.googlecode.com


// suppress multiple submits within this window
var FORM_SUBMIT_TOLERANCE = 2000; // ms



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


// form control changes
$('form').change(function(eventObject) {
	var target = jQuery(eventObject.target);
//	need to factor in :checked for radio/checkbox groups, or .val() seems to return the wrong thing
//	might need to implement an alternative to .val(), a wrapper like formValue() which extends this as desired
	var control = jQuery('*[name="' + target.attr('name') + '"]', this);
	debug('form changed: this = ' + this.tagName + '; control = ' + target.attr('name') + "; new value = " + control.val());
});



// form submission
$('form').submit(function() {
	var now = new Date().getTime();
	var form = jQuery(this);
	function cancel() {
		// shake button (negative feedback)
		form.addClass('submit');
		debug("cancel submit");
		debug("unable to " + (form.data('action').toLowerCase() || "submit form"));
		return false;
	}
	
	// suppress, if repeated submit within timeframe (milliseconds)
	if (form.data('submitted') && now - form.data('submitted') < FORM_SUBMIT_TOLERANCE) {
		debug("multiple form submission detected: < " + FORM_SUBMIT_TOLERANCE + " ms since last submit");
		return cancel();
	}
	form.data('submitted', now);

	//1. validate any fields with validation status 'unknonwn'
	
	jQuery(':text', form).filter(':not(:valid, :invalid)').css('background', 'cyan');	//.validate();

	//5. display the error summary
	//6. scroll to the error summary

	if (jQuery(':invalid', form).length > 0) return cancel();

	// FALSE (while developing)
	if (DEBUG_MODE) return false;
	return true;
});


// submit button pressed
$(':submit').click(function() {
	var action = jQuery(this);
	action.parents('form').data('action', action.attr('value') || "Submit form");
});

