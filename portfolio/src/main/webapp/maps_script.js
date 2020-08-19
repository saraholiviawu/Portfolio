// maps_script.js stores functions related to the maps API feature

// Store colors in a dictionary
var colors = {
  "color1" : "#242f3e", // Dark blue
  "color2" : "#746855", // Neutral brown
  "color3" : "#d59563", // Muted orange
  "color4" : "#263c3f", // Blue black
  "color5" : "#6b9a76", // Muted green
  "color6" : "#38414e", // Dark gray-blue
  "color7" : "#212a37", // Darker gray-blue
  "color8" : "#9ca5b3", // Murky light blue
  "color9" : "#1f2835", // Even darker gray-blue
  "color10" : "f3d19c", // Creamy orange
  "color11" : "#2f3948", // Another gray-blue
  "color12" : "#17263c", // More dark blue of the gray-blue
  "color13" : "#515c6d", //  Muted medium dark blue
  }

// Initializes a map and adds it to the page 
function createMapFunction() {
  var mapKey = config.MAP_KEY;
  var script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=' + mapKey + '&callback=initMap';
  script.defer = true;
  script.async = true;
  window.initMap = function() {
    const map = new google.maps.Map(
      document.getElementById('map'),
      {center: {lat: 37.0902, lng: -95.7129},
      zoom: 2,
      styles: [
        {elementType: 'geometry', stylers: [{color: colors.color1}]},
        {elementType: 'labels.text.stroke', stylers: [{color: colors.color1}]},
        {elementType: 'labels.text.fill', stylers: [{color: colors.color2}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: colors.color3}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: colors.color3}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: colors.color4}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
            stylers: [{color: colors.color5}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: colors.color6}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: colors.color7}]
        },
        {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{color: colors.color8}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: colors.color2}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: colors.color9}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: colors.color10}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: colors.color11}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: colors.color3}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: colors.color12}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: colors.color13}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: colors.color12}]
        }
      ]}
    );

    var geocoder = new google.maps.Geocoder();
    function callGeocodeAddress(address, userName, userText) {
      geocodeAddress(geocoder, map, address, userName, userText);
    }
    // Allow for call to nested function
    createMapFunction.callGeocodeAddress = callGeocodeAddress;

  };
  document.head.appendChild(script);
}

function geocodeAddress(geocoder, resultsMap, address, userName, userText) {
  geocoder.geocode({'address' : address}, function(results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
      var contentStr = '<div class="content-marker">' +
        '<h2 class="first-heading">' + userName + '</h2>' +
        '<div class="body-content">' +
        '<p>'+ address + '</p></br><p>' +
        userText + '</p></div>';
      
      var infowindow = new google.maps.InfoWindow({
        content : contentStr
      });

      var marker = new google.maps.Marker({
        map : resultsMap,
        position: results[0].geometry.location,
      });
      // If user clicks on marker, an info window will pop up displaying user name and address
      // If user clicks on a marker with an info window opened, window will close.
      var clickedMarker = false;
      marker.addListener('click', function() {
        if (clickedMarker == false) {
          infowindow.open(map, marker);
          clickedMarker = true;
        } else {
          infowindow.close(map, marker);
          clickedMarker = false;
        }
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}