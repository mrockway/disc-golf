$(function() {
	console.log('profile script');

	var courseData;
	var eventData;
	var courseSource = $('#course-template').html();
	var courseTemplate = Handlebars.compile(courseSource);
	var courseHTML = courseTemplate({courses: courseData});
	var eventSource = $('#events-template').html();
	var eventsTemplate = Handlebars.compile(eventSource);
	var eventHTML = eventsTemplate({events: eventData});

	// GET route for local courses
	$.get('/courses', function(data) {
			courseData = data.courses;
			console.log(courseData);
			courseHTML = courseTemplate({courses: courseData});
			$('.coursesDiv').append(courseHTML);
		});


	//GET route for local events
	$.get('/events', function (data) {
			console.log(data.events);
			eventData = data.events;
			eventHTML = eventsTemplate({events: eventData});
			$('.eventsDiv').append(eventHTML);
		});	

	//show course details
	$('.coursesDiv').on('click', '.moreInfo', function(event){
		console.log('button clicked');
		$('.courseDetailsDiv').toggle();
	});

});