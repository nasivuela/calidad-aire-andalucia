(function() {
	const andaluciaCoordinates = {
		lat: 37.5442706,
		lng: -4.7277528
	};

	const airQualityColors = {
		0: 'black', // Station can't measure that kind of data
		1: 'black', // day without data
		2: 'green', // GOOD
		3: 'yellow', // OOOPS
		4: 'orange', // BAD
		5: 'red' // RUN FOR YOUR LIFE
	};

	const areas = [
		'almeria',
		'cadiz',
		'cordoba',
		'granada',
		'huelva',
		'jaen',
		'malaga',
		'sevilla'
	];

	///
	const map = L.map('mapid').setView(
		[andaluciaCoordinates.lat, andaluciaCoordinates.lng],
		8
	);

	L.tileLayer(
		'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
		{
			attribution:
				'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			maxZoom: 18,
			id: 'mapbox/streets-v11',
			accessToken:
				'pk.eyJ1IjoibmFzaXZ1ZWxhIiwiYSI6ImNrNWJpcG9vazAwdmwzbGw0d2FkcmRpeG4ifQ.1YrZrlBhE6BszuSL27jAWg'
		}
	).addTo(map);

	/////

	const circles = [];

	function addCircle(lat, lng, color) {
		const circle = L.circleMarker([lat, lng], {
			color: color,
			fillColor: color,
			fillOpacity: 0.5,
			radius: 16
		}).addTo(map);
		circles.push(circles);

		circle.bindPopup('I am a circle.');
	}

	////

	const popup = L.popup();

	function onMapClick(e) {
		popup
			.setLatLng(e.latlng)
			.setContent('You clicked the map at ' + e.latlng.toString())
			.openOn(map);
	}

	map.on('click', onMapClick);

	// FETCH

	function fetchPlaces(data) {
		data.stations.forEach(s => {
			const color = airQualityColors[s.g];
			const { lat, lng } = andaluciaCoordinates;
			addCircle(lat, lng, color);
		});
	}

	function fetchAreasInfo() {
		areas.forEach(city => {
			fetch(
				`https://ajnavarro.com/api-calidad-aire-andalucia/v0/${city}/2019/1/7.json`
			)
				.then(r => r.json())
				.then(response => fetchPlaces(response, city));
		});
	}

	function init() {
		fetchAreasInfo();
	}

	init();
})();
