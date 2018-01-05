var apiUrl = appConfig.api;
var phoneMask = ['+', /[1-9]/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

// Assuming you have an input element in your HTML with the class .myInput 
var myInput = document.querySelector('#mobile-input')

var maskedInputController = vanillaTextMask.maskInput({
  inputElement: myInput,
  mask: phoneMask
})

$(function () {
	$('#subscribe-form').each(function() {
		$(this).on('submit', function(e) {
			if (e) {
				e.preventDefault();
				e.stopPropagation();
			}
			subscribe.call(this);
		});
  });
});

var subscribe = $.throttle(500, true, function () {

  var form = $(this);
	var payload = {
		email: $('#email-input').val(),
		phone: $('#mobile-input').val()
	};
	
	if (!payload.email) 
    return;
    
  if (payload.phone)
		payload.phone = payload.phone.replace( /[^0-9\.]/g, '');

	setWait(true);

	$.ajax(appConfig.api + '/subscriptions', {
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify(payload)
	})
	.done(function (response) {
		toastr["success"]("Thank you!");
		form.children('input').blur();
		form[0].reset();
		window.open('./thank-you.html', '_self');
	})
	.fail(function (rejection) {
		console.log(rejection);
		toastr["error"](rejection.statusText);
	})
	.always(function () {
		setWait(false);
	});
});

function setWait(isWait) {
	if (isWait) {
		$('.submit-form-btn').prop('disabled', true);
		$('body').addClass('wait');
	} else {
		$('.submit-form-btn').prop('disabled', false);
		$('body').removeClass('wait');
	}
}