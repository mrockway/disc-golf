$(function() {
	console.log('fore');
	var zipCode;
	//submit search form data
	$('.searchCourse').submit(function(event) {
		zipCode = $('#postal_code').val();
		return zipCode;
	});

});