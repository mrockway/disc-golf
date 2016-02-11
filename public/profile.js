$(function() {

	var courseSource = $('#course-template').html();
	var courseTemplate = Handlebars.compile(courseSource);
	var eventSource = $('#events-template').html();
	var eventsTemplate = Handlebars.compile(eventSource);

	var year = new Date();
	year = year.getFullYear();

	// GET route for local courses
	$.get('/courses', {
		zip: localStorage.getItem('zipCode')
	}, function(data) {
		var courseData = data.courses;
		// Check to see if zipCode comes back with results
		if (!courseData) {
			alert('No Courses Found. Please enter another zip code');
			//window.location.replace('/');
		} else {	
			var courseHTML = courseTemplate({
			courses: courseData
			});
		
			// draw map based on course results
			createMap(courseData);

			// Append course results to the page
			$('.coursesDiv').append(courseHTML);
			$('.courseDetailsDiv').hide();
			
			// Save Course state to pass as parameter in events search on page load
			var courseState = ('courseState',courseData[0].state_province);
			var stateName = ('stateName', courseData[0].state_province_name);
			getEvents(courseState, stateName);
		}
	});

	//GET route for local events
	function getEvents(stateAbb, stateName ) {
		var eventQuery = stateAbb;
		var eventStateName = stateName;
		$.get('/events', {state: eventQuery}, function(data) {
			var eventData = data.events;
			formatDates(eventData);
			eventData[0].state_province_name = eventStateName;
			var eventHTML = eventsTemplate({
				events: eventData
			});
			$('.eventsDiv').append(eventHTML);
			$('.eventsList').hide();
		});
	}

	//show course details
	$('.coursesDiv').on('click', '.moreInfo', function(event) {
		var courseId = $(this).closest('.courseList').attr('data-id');
		$("#"+courseId).toggle();
	});

	//show events
	$('.eventsDiv').on('click', '.showEventsButton', function(event) {
		$('.eventsList').toggle();
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
		var geojson = [];
	  
	  // add map points for each location returned from API
	  for (i=0; i<courseData.length; i++) {
		  var coursePoint = {
		    "type": "Feature",
		    "geometry": {
		      "type": "Point",
		      "coordinates": [courseData[i].longitude,courseData[i].latitude]
		    },
		    "properties": {
		      'title': '<a target="_blank" href="https://www.pdga.com/node/'+courseData[i].course_node_nid+'">'+courseData[i].course_name+'</a>',
		      'url': "https://www.pdga.com/node/"+courseData[i].course_node_nid,
		      'icon': {
		      	'iconUrl': 'basket.png',
		      	'iconSize': [50,50],
		      	'iconAnchor': [25,25],
		      	'popupAnchor': [0,-25],
		      	'className': 'dot'
		      }
		    }
		  };	
	  geojson.push(coursePoint); 
	  }
	  myLayer.on('layeradd', function(event) {
	  	var marker = event.layer,
	  			feature = marker.feature;

	  	marker.setIcon(L.icon(feature.properties.icon));
	  });
		myLayer.setGeoJSON(geojson);
		map.fitBounds(myLayer.getBounds());
	}

	// get window height and resize index background image
	function courseListDivSize() {
		var windowHeight = window.innerHeight;
		var divHeight = windowHeight - 80;
		$('.coursesDiv').css('height', divHeight);
	}
	
	// change background size when window changes
	$(window).resize( function() {
		courseListDivSize();
	});

	courseListDivSize();



});

