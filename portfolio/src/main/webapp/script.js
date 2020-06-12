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
    checkLogin();
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
    function callGeocodeAddress(address, userName, userText) {
      geocodeAddress(geocoder, map, address, userName, userText);
      console.log("successfully called callGeocodeAddress");
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
        '<p>'+ address + '</p></br>' +
        '<p>' + userText + '</p></div>';
      
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
        console
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
var currUserEmail = "";
// Function checks whether user is logged in when body loads
function checkLogin() {
  fetch('/login')
  .then(response => response.json()) // parses the response as JSON
  .then((userInfo) => { // now we can reference the fields in myObject!
    const loginWrapperElement = document.getElementById('login-wrapper');
    loginWrapperElement.innerHTML = "";
    if (userInfo.isUserLoggedIn == true) {
      // If user is logged in, provide a log out URl underneath the comment form
      loginWrapperElement.innerText = 'Log out';
      loginWrapperElement.href = userInfo.logoutUrl;
      document.getElementById('user-form').style.display = "block";
      currUserEmail = userInfo.currUserEmail;
    } else {
      loginWrapperElement.innerText = 'Log in';
      loginWrapperElement.href = userInfo.loginUrl;
      document.getElementById('user-form').style.display = "none";
    }
    return loginWrapperElement;
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
        commentListElement.appendChild(createCommentElement(comment, currUserEmail));
        createMapFunction.callGeocodeAddress(comment.address, comment.name);
    });
  });
}

// Create a comment element
function createCommentElement(comment, currUserEmail) {

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

  commentElement.appendChild(nameElement);
  commentElement.appendChild(emailElement);
  commentElement.appendChild(addressElement);
  commentElement.appendChild(textElement);

  if (currUserEmail == comment.email) {
    const deleteButtonElement = document.createElement('button');
    deleteButtonElement.innerText = 'Delete';
    deleteButtonElement.addEventListener('click', () => {
    deleteComment(comment);
    // Remove the task from the DOM.
      commentElement.remove();
    });
    commentElement.appendChild(deleteButtonElement);
  }
  
  return commentElement;
}

// Tells the server to delete the task.
function deleteComment(comment) {
  const params = new URLSearchParams();
  params.append('id', comment.id);
  fetch('/delete-comment', {method: 'POST', body: params});
}