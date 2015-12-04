$(function() {

	var courseData;
	var eventData;
	var courseSource = $('#course-template').html();
	var courseTemplate = Handlebars.compile(courseSource);
	var courseHTML = courseTemplate({ courses: courseData	});
	var eventSource = $('#events-template').html();
	var eventsTemplate = Handlebars.compile(eventSource);
	var eventHTML = eventsTemplate({ events: eventData });

	var year = new Date();
	year = year.getFullYear();

	// Save zipCode to local storage to be used on page
	function saveZipCode() {
		var zipCode = localStorage.getItem('zipCode');
		if (zipCode.match(/\d/)) {
			var checkZipCode = window.location.search.substring(1);
			checkZipCode = checkZipCode.split('=')[1];
			if(checkZipCode) {
				var zipCodeUrl = (window.location.search.substring(1));
				zipCode = zipCodeUrl.split("=")[1];
				localStorage.setItem('zipCode', zipCode);
				return;
			} else {
				zipCode = localStorage.getItem('zipCode');
				localStorage.setItem('zipCode', zipCode);
				return;
			}	
		} else {
				var newZipCodeUrl = (window.location.search.substring(1));
				zipCode = newZipCodeUrl.split("=")[1];
				localStorage.setItem('zipCode', zipCode);
			}
	}		

	saveZipCode();

	// GET route for local courses
	$.get('/courses', {
		zip: localStorage.getItem('zipCode')
	}, function(data) {
		courseData = data.courses;
		// Check to see if zipCode comes back with results
		if (!courseData) {
			alert('Please enter a valid zipCode');
			window.location.replace('/');
		} else {	
			courseHTML = courseTemplate({
			courses: courseData
			});
		}

		// Append course results to the page
		$('.coursesDiv').append(courseHTML);
		$('.courseDetailsDiv').hide();
		
		// Save Course state to pass as parameter in events search on page load
		var courseState = ('courseState',courseData[0].state_province);
		var stateName = ('stateName', courseData[0].state_province_name);
		getEvents(courseState, stateName);
	});

	//GET route for local events
	function getEvents(stateAbb, stateName ) {
		var eventQuery = stateAbb;
		var eventStateName = stateName;
		$.get('/events', {state: eventQuery}, function(data) {
			eventData = data.events;
			formatDates(eventData);
			eventData[0].state_province_name = eventStateName;
			eventHTML = eventsTemplate({
				events: eventData
			});
			$('.eventsDiv').append(eventHTML);
		});
	}

	//show course details
	$('.coursesDiv').on('click', '.moreInfo', function(event) {
		var courseId = $(this).closest('.courseList').attr('data-id');
		$("#"+courseId).toggle();
	});


	// Convert event dates from API to a more readable format
	function formatDates(arr) {
		for (i = 0; i < arr.length; i++) {
			var formatedStartDate = (arr[i].start_date).split("-");
			var formatedEndDate = (arr[i].end_date).split("-");
			formatedStartDate = formatedStartDate[1]+'-'+formatedStartDate[2]+'-'+formatedStartDate[0];
			formatedEndDate = formatedEndDate[1]+'-'+formatedEndDate[2]+'-'+formatedEndDate[0];
			arr[i].start_date = formatedStartDate;
			arr[i].end_date = formatedEndDate;
		}
		return arr;
	}
});

