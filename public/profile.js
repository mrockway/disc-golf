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
		console.log(courseData);
		// Check to see if zipCode comes back with results
		if (!courseData) {
			alert('Please enter a valid zipCode');
			window.location.replace('/');
		} else {	
			courseHTML = courseTemplate({
			courses: courseData
			});
		}

		// draw map based on course results
		createMap(courseData);

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
		console.log(eventStateName);
		$.get('/events', {state: eventQuery}, function(data) {
			eventData = data.events;
			formatDates(eventData);
			eventData[0].state_province_name = eventStateName;
			console.log(eventData[0].start_date);
			eventHTML = eventsTemplate({
				events: eventData
			});
			$('.eventsDiv').append(eventHTML);
			console.log(eventData);
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

	// mapbox creation
	function createMap(courseData) {
		L.mapbox.accessToken = 'pk.eyJ1IjoibXJvY2t3YXkiLCJhIjoiY2locW1mMGo3MDRwcXVybHhhMXRrbXU1MyJ9.-5Z2oWSNPlsLGMP_5_mMog';
		var map = L.mapbox.map('map', 'mapbox.emerald').setView([37.8, -96], 4);
		var myLayer = L.mapbox.featureLayer().addTo(map);
		var geojson = [
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-77.031952,38.913184]
    },
    "properties": {
      "title": "Mapbox DC",
      "description": "1714 14th St NW, Washington DC",
      "marker-color": "#3ca0d3",
      "marker-size": "large",
      "marker-symbol": "rocket"
    }
  },
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-122.413682,37.775408]
    },
    "properties": {
      "title": "Mapbox SF",
      "description": "155 9th St, San Francisco",
      "marker-color": "#63b6e5",
      "marker-size": "large",
      "marker-symbol": "rocket"
    }
  }
];
myLayer.setGeoJSON(geojson);
	}
	

	// end mapbox

});

