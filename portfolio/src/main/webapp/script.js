// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* Generates a URL for a random image in the images directory and adds an img
   element with that URL to the page. */
function randomizeImage() {
  // The images directory contains 10 images, so generate a random index between
  // 1 and 10.
  const imageIndex = Math.floor(Math.random() * 10) + 1;
  const imgUrl = 'images/travel' + imageIndex + '.jpg';

  const imgElement = document.createElement('img');
  imgElement.src = imgUrl;

  const imageContainer = document.getElementById('random-image-container');
  // Remove the previous image.
  imageContainer.innerHTML = '';
  imageContainer.appendChild(imgElement);


  const captions =
      ['Redondo Beach Pier in California', 'Riviera Village in Southern California', 'Louvre Museum in Paris, France', 'Nice, France',
        'Park Güell in Barcelona, Spain', 'OK Hostel in Madrid, Spain', 'Fiesta de San Juan in Bilbao, Spain', 'Bilbao, Spain', 'Redondo Beach Pier in Southern California', "Yale University in New Haven, Connecticut"];
  
  const caption = captions[imageIndex-1];
  
  const captionContainer = document.getElementById('random-image-caption');
  captionContainer.innerText = caption;
}

function onloadFunction() {
    commentFunction('5');
    createMapFunction();
    console.log("Testing onload()")
}

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
  console.log(config.MAP_KEY);
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
    function callGeocodeAddress(address) {
      geocodeAddress(geocoder, map, address);
      console.log("successfully called callGeocodeAddress");
    }
    // Allow for call to nested function
    createMapFunction.callGeocodeAddress = callGeocodeAddress;

    // Create an info window
    var contentStrTrexMarker = '<div id="content-trex-marker">' +
      '<div id="site-notice">' +
      '<h1 id="first-heading" class="first-heading">Stan the T-rex</h1>' +
      '<div id="body-content">' +
      '<p>This is the marker for Stan the T-rex!</p>';

    var infowindow = new google.maps.InfoWindow({
      content: contentStrTrexMarker
    });

    const trexMarker = new google.maps.Marker({
      position: {lat: 37.421903, lng: -122.084674},
      map: map,
      title: 'Stan the T-rex'
    });
    trexMarker.addListener('click', function() {
      infowindow.open(map, trexMarker);
    });
  };
  document.head.appendChild(script);
}

function geocodeAddress(geocoder, resultsMap, address) {
//   var address = document.getElementById('address').value;
  geocoder.geocode({'address' : address}, function(results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map : resultsMap,
        position: results[0].geometry.location,
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function commentFunction(showComments) {

  // Clear out existing children
  document.getElementById('history').innerHTML = "";

  // If user is logged in
  fetch('/data?show-comments='+showComments)  //
  .then(response => response.json()) // parses the response as JSON
  .then((comments) => { // now we can reference the fields in myObject!
    const commentListElement = document.getElementById('history');
    comments.forEach((comment) => {
        commentListElement.appendChild(createCommentElement(comment));
        createMapFunction.callGeocodeAddress(comment.address);
    });
  });
}

// Create a comment element
function createCommentElement(comment) {
  const commentElement = document.createElement('li');
  commentElement.className = 'comment';

  const nameElement = document.createElement('h4');
  nameElement.innerText = comment.name;

  const emailElement = document.createElement('h3');
  emailElement.innerText = comment.email;

  const addressElement = document.createElement('p');
  addressElement.innerText = comment.address;

  const textElement = document.createElement('p');
  textElement.innerText = comment.text;
  
  const deleteButtonElement = document.createElement('button');
  deleteButtonElement.innerText = 'Delete';
  deleteButtonElement.addEventListener('click', () => {
    deleteComment(comment);

    // Remove the task from the DOM.
    commentElement.remove();
  });
  
  commentElement.appendChild(nameElement);
  commentElement.appendChild(emailElement);
  commentElement.appendChild(addressElement);
  commentElement.appendChild(textElement);
  commentElement.appendChild(deleteButtonElement);
  return commentElement;
}

// Tells the server to delete the task.
function deleteComment(comment) {
  const params = new URLSearchParams();
  params.append('id', comment.id);
  fetch('/delete-comment', {method: 'POST', body: params});
}