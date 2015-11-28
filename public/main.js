$(function() {
	console.log('fore');

	var courseData;
	var eventData;
	var zipCode;
	// var courseSource = $('#course-template').html();
	// var courseTemplate = Handlebars.compile(courseSource);
	// var courseHTML = courseTemplate({courses: courseData});
	// var eventSource = $('#events-template').html();
	// var eventsTemplate = Handlebars.compile(eventSource);
	// var eventHTML = eventsTemplate({events: eventData});

	//GET route for course data
	function getCourses(zipCode) {
		$.get('/courses', function(data) {
			courseData = data.courses;
			console.log(courseData);
			courseHTML = courseTemplate({
				courses: courseData
			});
			$('.coursesDiv').append(courseHTML);
		});
	}
	

	//submit search form data
	$('.searchCourse').submit(function(event) {
		event.preventDefault();
		zipCode = $(this).serialize();
		//console.log(zipCode);
		$.ajax({
			type: 'POST',
			url: '/courses',
			data: zipCode,
			dataType: 'String',
			success: function(data) {
				courseData = data.courses;
				console.log(courseData);
			}
		});
		console.log(zipCode);
		getCourses(zipCode);
	});

	//GET route for event data
	function getEvents(dates) {
		$.get('/events', function (data) {
			console.log(data.events);
			eventData = data.events;
			eventHTML = eventsTemplate({events: eventData});
			$('.eventsDiv').append(eventHTML);
		});	
	}
	

});