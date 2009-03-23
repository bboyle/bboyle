// jquery.bboyle.form.js
// Form handling
// bboyle.googlecode.com

(function(jQuery){
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


// register validators
jQuery.fn.extend({
	// control
	registerValidation:function(selector, validationFunction, errorMessage) {
		// get form
		var form = jQuery(this);
		if (!form.is('form')) {
			form = form.parents('form');
		}
		if (!form.is('form')) {
			return false;
		}

		/* the structure of validations should be
			[	<selector>:
				[
					{ function: <function>,
				  	  message:	<message> },
					{ function: <function2>,
				  	  message: <message2> }
				],
				<selector2>: ...
			]
			
			each selector is in the hash only once (for quick lookup)
			may have multiple functions, each with its own message
			
			e.g. expiry date
			      [ checkFormat(eventObject), "use MM/YY"]
			      [ checkExpire(eventObject), "date has passed"]

			where <eventObject> = the event object from the "change" event.
			(that won't work for submit!?)
			maybe pass control object instead.
			implement jQuery *.control()
		*/
			
	}
});



// form control changes
$('form').change(function(eventObject) {
	var target = jQuery(eventObject.target);
//	need to factor in :checked for radio/checkbox groups, or .val() seems to return the wrong thing
//	might need to implement an alternative to .val(), a wrapper like formValue() which extends this as desired
	var control = jQuery('*[name="' + target.attr('name') + '"]', this);
	debug('form changed: this = ' + this.tagName + '; control = ' + target.attr('name') + "; new value = " + control.val());
	
	// validate against matching validators
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

})(jQuery);