var $, jQuery; 
$ = jQuery = require('jquery');
require('jquery-ui');

(function($) {
	$(document).ready( 
		function() {
			console.log("OK",$("#newTodoDateField"))
			$("#newTodoDateField").datepicker();
		}
	);
})(jQuery);