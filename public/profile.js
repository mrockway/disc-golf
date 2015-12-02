$(function() {
	console.log('profile script');

	var courseData;
	var eventData;
	var courseSource = $('#course-template').html();
	var courseTemplate = Handlebars.compile(courseSource);
	var courseHTML = courseTemplate({ courses: courseData	});
	var eventSource = $('#events-template').html();
	var eventsTemplate = Handlebars.compile(eventSource);
	var eventHTML = eventsTemplate({ events: eventData });
	//var defaultEventState = [];

	// populate events column on page load
	//getCurrentDate();
	//getEvents(defaultEventDate);

	// get current date and 3 months from today
	// function getCurrentDate() {
	// 	var today = new Date();
	// 	var day = ('0' + (today.getDate())).slice(-2);
	// 	var month = ('0' + ((today.getMonth()) + 1)).slice(-2);
	// 	var year = (today.getFullYear());
	// 	var futureMonth;
	// 	var futureYear = year;
	// 	if (month > 9) {
	// 		futureMonth = ('0' + (((today.getMonth()) - 8))).slice(-2);
	// 		futureYear = (today.getFullYear() + 1);
	// 	} else {
	// 		futureMonth = ('0' + ((today.getMonth()) + 1)).slice(-2);
	// 	}
	// 	today = month + '/' + day + '/' + year;
	// 	future = futureMonth + '/' + day + '/' + futureYear;
	// 	defaultEventDate.push(today, future);
	// 	console.log('defaultEventDate', defaultEventDate);
	// }


	// Generate Calender
	// function generateCalender() {
	// 	var currentYear = (new Date()).getFullYear();
	// 	console.log('currentYear', currentYear);
	// 	for (i = currentYear; i < (currentYear + 5); i++) {
	// 		$('#startYear').append('<option value=' + i + '>' + i + '</option>');
	// 		$('#endYear').append('<option value=' + i + '>' + i + '</option>');
	// 	}
	// 	for (i = 1; i < 32; i++) {
	// 		$('#startDay').append('<option value=' + i + '>' + i + '</option>');
	// 		$('#endDay').append('<option value=' + i + '>' + i + '</option>');
	// 	}
	// }
	// generateCalender();

	function saveZipCode() {
		var zipCode = localStorage.getItem('zipCode');
		console.log('zipCode',typeof zipCode);
		if (zipCode !== 'undefined') {
			var checkZipCode = ((window.location.search.substring(1))).split('=')[1];
			if(zipCode !== checkZipCode) {
				var zipCodeUrl = (window.location.search.substring(1));
				zipCode = zipCodeUrl.split("=")[1];
				localStorage.setItem('zipCode', zipCode);
				console.log('zipCodeUrl', zipCodeUrl);
			} else {
				zipCode = localStorage.getItem('zipCode');
				console.log('localStorage',zipCode);
				return zipCode;
				
			}	
		} else {
				var newZipCodeUrl = (window.location.search.substring(1));
				zipCode = newZipCodeUrl.split("=")[1];
				localStorage.setItem('zipCode', zipCode);
				console.log('zipCodeUrl', newZipCodeUrl);
			}
	}		

	saveZipCode();

	// GET route for local courses
	$.get('/courses', {
		zip: localStorage.getItem('zipCode')
	}, function(data) {
		courseData = data.courses;
		console.log('coursedata', courseData);
		courseHTML = courseTemplate({
			courses: courseData
		});
		$('.coursesDiv').append(courseHTML);
		$('.courseDetailsDiv').hide();
		var courseState = ('courseState',courseData[0].state_province);
		getEvents(courseState);
	});

	//GET route for local events
	function getEvents(state) {
		var eventQuery = state;
		console.log('eventq',eventQuery);
		$.get('/events', {state: eventQuery}, function(data) {
			eventData = data.events;
			console.log('eventsdata', data.events);
			eventHTML = eventsTemplate({
				events: eventData
			});
			$('.eventsDiv').append(eventHTML);
		});
	}

	//show course details
	$('.coursesDiv').on('click', '.moreInfo', function(event) {
		var courseId = $(this).closest('.courseList').attr('data-id');
		console.log(courseId);
		$("#"+courseId).toggle();
	});
});