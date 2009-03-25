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
		// TODO run all validations rather than check class?
		// would support:
		//		1. onchange(e) e.target.is(:valid) ?
		//		2. onsubmit() form.find(:invalid)
		return jQuery(e).hasClass('valid');
	},
	// required
	required: function(e) {
		return jQuery(e).hasClass('required');
	},
	// has pattern
	pattern: function(e) {
		return jQuery(e).data('pattern') != null;
		// TODO support WF2
		// return jQuery(e).attr('pattern') != null || jQuery(e).data('pattern') != null;
	},
	// blank fields
	blank: function(e) {
		return jQuery.trim(jQuery(e).val()).length <= 0;
	}
});


// register validators
jQuery.fn.extend({
	
	
	// get/set a pattern
	pattern:function(pattern) {
		if (pattern != null) {
			return this.data('pattern', pattern);
		}
		return this.data('pattern');
	},
	

	// remove a pattern
	removePattern:function() {
		return this.removeData('pattern');
	},
	
	
	// get/set validation
	// selector	::= jQuery selector string (may be omitted)
	// TODO how to manage multiple selectors (comma separated)
	// warning	::= (String) warning message when test fails
	// test		::= function(control) returns true/false
	// returns jQuery
	validation:function(selector, warning, test) {
		// TODO better argument checking
		if (!this.is('form')) {
			if (test == null && selector != null) {
				if (!this.is('input,select,textarea')) {
					debug('bad validation() call');
					return this;
				}
				test = warning;
				warning = selector;
				// TODO use @name or @id? radio/checkbox vs other controls
				selector = '*[name="' + this.attr('id') + '"]';
			}
			return this.parent().validation(selector, warning, test);
		}

		// make sure it is an array
		// TODO move this to form setup?
		if (this.data('validation') == null) this.data('validation', []);

		// get validation
		if (selector == null) {
			return this.data('validation');
		}

		// set on form
		this.data('validation').push({
			selector: selector,
			warning: warning,
			test: test
		});
		
		// TODO don't always return the form object, replace recursion with traversal
		return this;
	},
	
	
	// validate
	validate:function() {
		if (!this.is('form')) return this.parent().validate();
		
		// validate all controls
		var validation = this.validation();
		this.find(':text').each(function() {
			// TODO should call .validate() on each control, not use .each()
			var field = jQuery(this);
			for (var i = 0; i < validation.length; i++) {
				if (field.is(validation[i].selector)) {
					debug('testing validation ' + validation[i].selector);
					if (!validation[i].test(field)) {
						debug(field.attr('id') + ' failed test: ' + validation[i].warning);
						field.data('invalid', validation[i].warning);
						// TODO should finish loop at this point
					}
				}			
			}
			// tests complete, update class
			var valid = field.data('invalid') == null;
			field.addClass(valid ? 'valid' : 'invalid');
		});
		return this;
	},
	
	
	// revalidate
	revalidate:function() {
		this.removeClass('invalid');
		this.removeClass('valid');
		this.removeData('invalid');
		return this.validate();
	},
	
	/**
	 * "shake it like a polaroid picture".
	 * shake plugin provides negative feedback to the user by shaking a ui element left and right.
	 * This animation is similar to head shake gesture for "no" in Western cultures.
	 * This approach has been taken for some Mac OS X UIs.
	 * 
	 * @param interval (integer, optional) The number of ms between animations
	 * @param distance (integer, optional) Pixel distance to shake the ui element left and right of 
	          its initial position
	 * @param shakes   (integer, optional) The number of times to shake the ui element
	 * @return this jQuery object, to facilitate chaining
	 */
	shake:function(/* optional */ interval, /* optional */ distance, /* optional */ shakes ) {
		// init defaults for optional arguments
		var interval = interval || 75;
		var distance = distance || 10;
		var shakes = shakes || 2;
		
		// store original margin offsets
		var leftMargin = parseInt($(this).css('marginLeft'));
		var rightMargin = parseInt($(this).css('marginRight'));
		
		for (var i = 0; i < shakes; i++) {
			$(this)
				.animate({ marginLeft: leftMargin-distance, marginRight: rightMargin+distance }, interval)
				.animate({ marginLeft: leftMargin+distance, marginRight: rightMargin-distance }, interval)
			;
		}
		
		// reset margins to original offsets
		return $(this).animate({ marginLeft: leftMargin, marginRight: rightMargin }, interval);
	}
});



// form control changes
$('form').change(function(eventObject) {
	var target = jQuery(eventObject.target);
//	need to factor in :checked for radio/checkbox groups, or .val() seems to return the wrong thing
//	might need to implement an alternative to .val(), a wrapper like formValue() which extends this as desired
	var control = jQuery('*[name="' + target.attr('name') + '"]', this);
	debug('form changed: this = ' + this.tagName + '; control = ' + target.attr('name') + "; new value = " + control.val());
	
	// TODO validate against matching validators
	// target.validate();
});



// form submission
$('form').submit(function(eventObj) {
	var now = new Date().getTime();
	var form = jQuery(this);
	function cancel() {
		// shake button (negative feedback)
		// TODO REVIEW perhaps the whole form should shake? (like mac os x password dialog).
			//$(form).shake();
		
		if (eventObj && eventObj.originalEvent && eventObj.originalEvent.explicitOriginalTarget) {
			// try to shake the ui element that triggered this submit event (Mozilla only)
			$(eventObj.originalEvent.explicitOriginalTarget).shake();
		} else {
			// No explicit original triggering ui element found, default to first submit button
			$(form.find(':submit')).eq(0).shake();
		}
			
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
	form.validate();
	
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


// core validation: required fields
$('form.validate').validation(':required', 'must be completed', function(control) {
	return control.is(':not(:blank)');
});

// core validation: patterns
$('form.validate').validation(':pattern', 'incorrect format', function(control) {
	return control.val().match(control.pattern()) || control.is(':blank:not(:required)');
});

})(jQuery);
