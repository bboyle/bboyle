// jquery.bboyle.form.js
// Form handling
// bboyle.googlecode.com

(function(jQuery){
// suppress multiple submits within this window
var FORM_SUBMIT_TOLERANCE = 2000; // ms

/* TODO

would this work as an onchange strategy?

this.is(':invalid') { 
        .control().removeClass('valid').addClass('invalid').removeAll('.alert').append($('<em class="alert">' + this.data('warning') + '</em>'));

} else { 
        .control().removeAll('.alert').removeClass('invalid').addClass('valid') 
}

where the 'invalid' selector is more than a wrapper that checks class name presence,
it would actually validate the field!

:invalid { 
        // run all validation tests 
        if test result = false, set warning and return false 
        return true 
}

?QUESTION?
would performance suffer? how often would :invalid be called??
should it cache validation status when data doesn't change ...?

if (this.data('oldValue) != this.val() ) ... 
... time to validate() and update .data('oldValue')
?

*/


/* TODO

possible filters based on web forms 2 (:wf-*) and xforms (:xf-*)

$(:wf2-date).validation("unrecognised date", func)
Vs
$(form.validate).validation(:wf2-date, "unrecognised date", func)

Latter option won't result in duplicate validations being stored for each matched control. 
Ask irama about livequery implementation

:xf-secret = li.secret (xforms inspired)
:xf-label = legend or label (contents)
:xf-hint = hint component (contents)

:wf2-date = input type=date
Web forms 2 inspired

Also :wf2-email

.required(func) set a function to determine required status
Like xforms, not wf2, richer functionality. 
Will constant evaluation be slow?
Only re-evaluate after a change() event?

.required(true) supported.
Also @required (wf2) and .required class context?

so "required()" can be passed either a boolean, or function that returns a boolean ...

*/


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
	},
	/**
	 * focussed element
	 * @see http://www.mail-archive.com/discuss@jquery.com/msg02847.html
	 */
	'focus': function(e) {
		return (document.activeElement) ? e == document.activeElement : false ;
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
		var leftMargin = parseInt(jQuery(this).css('marginLeft'));
		var rightMargin = parseInt(jQuery(this).css('marginRight'));
		
		for (var i = 0; i < shakes; i++) {
			jQuery(this)
				.animate({ marginLeft: leftMargin-distance, marginRight: rightMargin+distance }, interval)
				.animate({ marginLeft: leftMargin+distance, marginRight: rightMargin-distance }, interval)
			;
		}
		
		// reset margins to original offsets
		return jQuery(this).animate({ marginLeft: leftMargin, marginRight: rightMargin }, interval);
	}
});



// form control changes
jQuery('form').change(function(eventObject) {
	var target = jQuery(eventObject.target);
//	need to factor in :checked for radio/checkbox groups, or .val() seems to return the wrong thing
//	might need to implement an alternative to .val(), a wrapper like formValue() which extends this as desired
	var control = jQuery('*[name="' + target.attr('name') + '"]', this);
	debug('form changed: this = ' + this.tagName + '; control = ' + target.attr('name') + "; new value = " + control.val());
	
	// TODO validate against matching validators
	// target.validate();
});



// form submission
jQuery('form').submit(function(eventObj) {
	var now = new Date().getTime();
	var form = jQuery(this);
	function cancel() {
		// shake button (negative feedback)
		// if a submit button triggered the submit event shake it, otherwise shake the first submit button.
		if ((focussedSubmit = form.find(':submit:focus')).size() > 0) {
			focussedSubmit.shake();
		} else {
			form.find(':submit').eq(0).shake();
		}
		// TODO REVIEW perhaps the whole form should shake? (like mac os x password dialog).
			//jQuery(form).shake();

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
jQuery(':submit').click(function() {
	var action = jQuery(this);
	action.parents('form').data('action', action.attr('value') || "Submit form");
});


// core validation: required fields
jQuery('form.validate').validation(':required', 'must be completed', function(control) {
	return control.is(':not(:blank)');
});

// core validation: patterns
jQuery('form.validate').validation(':pattern', 'incorrect format', function(control) {
	return control.val().match(control.pattern()) || control.is(':blank');
});

})(jQuery);
