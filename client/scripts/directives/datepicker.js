'use strict';

module.exports = function datepicker() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel){
			$(element).datepicker({
				showOn:"both",
				changeYear:true,
				changeMonth:true,
				dateFormat:'yy-mm-dd',
				minDate: new Date(),
				beforeShow: function(input, inst) {
					var offset = $(input).offset();
					var height = $(input).height();
					setTimeout(
						function() {
							inst.dpDiv.css(
								{
									top: (offset.top + height + 4) + 'px', 
									left: offset.left + 'px',
								}
							);
							inst.dpDiv.css('font-size', '10px');
						}
					)
				},
				onSelect:function (dateText, inst) {
					scope.$apply(function(scope){
							// Change binded variable
							ngModel.$setViewValue(dateText);
					});
				}
			});
		}
	};
};