$(function() {
	console.log('fore');

	var courseData;
	var eventData;


	//GET route for course data
	// $.ajax({
	// 	type: 'GET',
	// 	url: '/courses',
	// 	success: function(data) {
	// 		console.log(data.courses);
	// 		courseData = data;
	// 	}
	// });

	//GET route for course data
	$.get('/courses', function(data) {
		console.log(data.courses);
		courseData = data.courses;
	});

	//GET route for event data
	$.get('/events', function(data) {
		console.log(data.events);
		eventData = data.events;
	});
});