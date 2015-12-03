$(function() {
	console.log('fore');
	
	function splashImageSize() {
		var windowHeight = window.innerHeight;
		var imageHeight = windowHeight - 50;
		$('.splashPage').css('height', imageHeight);
	}
	
	// change background size when window changes
	$(window).resize( function() {
		splashImageSize();
	});


	splashImageSize();


});