$(function() {
	console.log('profile script');

	var courseData;
	var eventData;
	var courseSource = $('#course-template').html();
	var courseTemplate = Handlebars.compile(courseSource);
	var courseHTML = courseTemplate({
		courses: courseData
	});
	var eventSource = $('#events-template').html();
	var eventsTemplate = Handlebars.compile(eventSource);
	var eventHTML = eventsTemplate({
		events: eventData
	});
	var defaultEventDate = [];

	// populate events column on page load
	getCurrentDate();
	getEvents(defaultEventDate);

	// get current date and 3 months from today
	function getCurrentDate() {
		var today = new Date();
		var day = ('0' + (today.getDate())).slice(-2);
		var month = ('0' + ((today.getMonth()) + 1)).slice(-2);
		var year = (today.getFullYear());
		var futureMonth;
		var futureYear = year;
		if (month > 9) {
			futureMonth = ('0' + (((today.getMonth()) - 8))).slice(-2);
			futureYear = (today.getFullYear() + 1);
		} else {
			futureMonth = ('0' + ((today.getMonth()) + 1)).slice(-2);
		}
		today = month + '/' + day + '/' + year;
		future = futureMonth + '/' + day + '/' + futureYear;
		defaultEventDate.push(today, future);
		console.log('defaultEventDate', defaultEventDate);
	}


	// Generate Calender
	function generateCalender() {
		var currentYear = (new Date()).getFullYear();
		console.log('currentYear', currentYear);
		for (i = currentYear; i < (currentYear + 5); i++) {
			$('#startYear').append('<option value=' + i + '>' + i + '</option>');
			$('#endYear').append('<option value=' + i + '>' + i + '</option>');
		}
		for (i = 1; i < 32; i++) {
			$('#startDay').append('<option value=' + i + '>' + i + '</option>');
			$('#endDay').append('<option value=' + i + '>' + i + '</option>');
		}
	}
	generateCalender();


	var zipCodeUrl = (window.location.search.substring(1));
	var zipCode = zipCodeUrl.split("=")[1];
	console.log('zipCode', zipCode);


	// GET route for local courses
	$.get('/courses', {
		zip: zipCode
	}, function(data) {
		courseData = data.courses;
		console.log('coursedata', courseData);
		courseHTML = courseTemplate({
			courses: courseData
		});
		$('.coursesDiv').append(courseHTML);
		$('.courseDetailsDiv').hide();
	});

	//GET route for local events
	function getEvents(dateArr) {
		var eventQuery = {
			startDate: dateArr[0],
			finishDate: dateArr[1]
		};
		$.get('/events', eventQuery, function(data) {
			console.log('eventsdata', data.events);
			eventData = data.events;
			eventHTML = eventsTemplate({
				events: eventData
			});
			$('.eventsDiv').append(eventHTML);
		});
	}

	//show course details
	$('.coursesDiv').on('click', '.moreInfo', function(event) {
		var courseId = $(this).closest('.mainList').attr('data-id');
		console.log(courseId);
		$("#"+courseId).toggle();
	});
});