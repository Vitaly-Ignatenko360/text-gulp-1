$(document).ready(function () {
	$("#form").submit(function () {
		$.ajax({
			type: "POST",
			url: "mail.php",
			data: $(this).serialize()
		}).done(function () {
			$('.wrapper').addClass('top');
			$('.wrapper').css({
				'transition': '.5s'
			});
			$('.shadow').fadeIn();
			$('.close').on('click', function (e) {
				e.preventDefault();
				$('.wrapper').removeClass('top');
				$('.wrapper').css({
					'transition': '1s'
				});
				$('.shadow').fadeOut();
			});
			$('.shadow').on('click', function (e) {
				e.preventDefault();
				$('.wrapper').removeClass('top');
				$('.shadow').fadeOut();
			});
			$("#form").trigger("reset");
		});
		return false;
	});

});