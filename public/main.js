$(function() {
	console.log('fore');
	
	// get window height and resize index background image
	function splashImageSize() {
		var windowHeight = window.innerHeight;
		var imageHeight = windowHeight - 50;
		$('.splashPage').css('height', imageHeight);
		$('.login_signin_background').css('height', imageHeight);
	}
	
	// change background size when window changes
	$(window).resize( function() {
		splashImageSize();
	});

	splashImageSize();

});