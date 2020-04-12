var appClass = {
		
	init: function() {
		console.log('app::init');
		this.setUpSelectors();
		this.doChangeForm();
	},
	
	orderFormSubmit: function(evt) {
		evt.preventDefault();
		var form = $(evt.target);
		
		if ($(form).find('.f-error').length === 0) {
			console.log("orderFormSubmit::good");
			this.orderFormProcess(form);
		} else {
			console.log("orderFormSubmit::error");
		}
	},
	
	subscribeFormSubmit: function(evt) {
		evt.preventDefault();
		var form = $(evt.target), data = $(form).serialize(), self = this, request;
		
		if ($(form).find('.f-error').length === 0) {
			console.log("subscribeFormSubmit::good");
			
			request = $.ajax({
				url: "/jigcode/javacontrollers/doSubscribe.php",
				method: "post",
				dataType: "json",
				data: form.serialize()
			});
				
			request.done(function(data) {
				console.log('success');
				console.log(data);
				$(form).find('[name=email]').val('');
				$('.popup_resultSubscribe').find('.popup__result-value').html(data.message);
				window.app.popup.open('#subResult');
			});
				
			request.fail(function(data) {
				console.log('fail');
				console.log(data);
			});
			
		} else {
			console.log("subscribeFormSubmit::error");
		}
		
	},
	
	orderFormProcess: function(form) {
		var data = $(form).serialize(), self = this, request;
		console.log(data);
		
		request = $.ajax({
			url: "/jigcode/javacontrollers/doOrder.php",
			method: "post",
			dataType: "json",
			data: form.serialize()
		});
			
		request.done(function(data) {
			console.log('success');
			console.log(data);
			$('.popup_result').find('.popup__result-value').html(data.order);
			window.app.popup.open('.popup_result');
		});
			
		request.fail(function(data) {
			console.log('fail');
			console.log(data);
		});
	},
	
	feedbackSubmit: function(evt) {
		evt.preventDefault();
		var form = $(evt.target), data = $(form).serialize(), self = this, request;
		console.log(data);
		
		if ($(form).find('.f-error').length === 0) {
		
			request = $.ajax({
				url: "/jigcode/javacontrollers/doFeedback.php",
				method: "post",
				dataType: "json",
				data: form.serialize()
			});
				
			request.done(function(data) {
				console.log('success');
				console.log(data);
				$('.popup_result').find('.popup__result-value').html(data.message);
				$(form).find('input').val('');
				window.app.popup.open('.popup_result');
			});
				
			request.fail(function(data) {
				console.log('fail');
				console.log(data);
			});
			
		}
	},
	
	changeOrder: function(evt) {
		var programm = $(evt.target).closest('.form__field').find('[name=programm]'),
			duration = $(evt.target).closest('.form__field').find('[name=duration]');
		if (programm.length) {
			this.doChangeForm();
			//console.log($(programm).val());
		}
		if (duration.length) {
			this.doChangeForm();
			//console.log($(duration).val());
		}
	},
	
	doChangeForm: function() {
		var programm = $('[name=programm]:checked'),
			duration = $('[name=duration]:checked');
		
		console.log('programm: ' + $(programm).val() + '; duration: ' + $(duration).val());
		for (var k in schem) {
			var one = schem [k];
			var ok = 0;
			for (var key in one) {
				if (key == "power" && one[key] == $(programm).val()) {
					ok++;
				}
				if (key == "duration" && one[key] == $(duration).val()) {
					ok++;
				}
			}
			if (ok === 2) {
				this.changeFormHtml(one);
			}
		}
	},
	
	calcResult: function() {
		var val = $('.js-calc-result').html(), result = {'value': val, 'delta': 1000000};
		if (Number.isInteger(parseInt(val))) {
			var power = parseInt(val);
			for (var k in schem) {
				var value = parseInt(schem [k]['power']), delta = Math.abs(power - value);
				if (result ['delta'] > delta) {
					result ['delta'] = delta;
					result ['value'] = value;
				}
			}
			$('.js-calc-result').html(result ['value']);
		}
	},
	
	changeFormHtml: function(data) {
		console.log('changeFormHtml');
		console.log(data);
		$('.order__foot-price > span').html(data['price']);
		$('.order__foot-info').html(data['text']);
		$('[name=result]').val(data['price']);
		$('.order__step.order__step_1').find('img').attr('src', data ['image']);
	},
	
	setUpSelectors: function() {
		console.log('app::setUpSelectors');
		$(document).on('submit', '#order_form', $.proxy(appClass.orderFormSubmit, appClass));
		$(document).on('submit', '#subscribe', $.proxy(appClass.subscribeFormSubmit, appClass));
		$(document).on('click', '.form__field', $.proxy(appClass.changeOrder, appClass));
		$(document).on('submit', '#feedback_form', $.proxy(appClass.feedbackSubmit, appClass));
	},
	
};

$(document).ready(function() {
	var appObj = Object.create(appClass);
	appObj.init();
	window.jigApp = appObj;
});
