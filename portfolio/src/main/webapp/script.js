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
// import { config } from "./config.js";

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
}

/** Initializes a map and adds it to the page */
// document.addEventListener('DOMContentLoaded', function () {
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
      {center: {lat: 37.422403, lng: -122.088073}, zoom: 15});
  };
  document.head.appendChild(script);
}

function commentFunction(showComments) {
  
  // Check if user is logged in. If so, unhide the form. If user not logged in, display a login link.
  fetch('/login')
  .then(response => response.json())

  // Clear out existing children
  document.getElementById('history').innerHTML = "";

  // If user is logged in
  fetch('/data?show-comments='+showComments)  // sends a request to /my-data-url
  .then(response => response.json()) // parses the response as JSON
  .then((comments) => { // now we can reference the fields in myObject!
    const commentListElement = document.getElementById('history');
    comments.forEach((comment) => {
        commentListElement.appendChild(createCommentElement(comment));
    });
  });
}

/* Create a comment element */
function createCommentElement(comment) {
  const commentElement = document.createElement('li');
  commentElement.className = 'comment';

  const nameElement = document.createElement('h4');
  nameElement.innerText = comment.name;

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
  commentElement.appendChild(textElement);
  commentElement.appendChild(deleteButtonElement);
  return commentElement;
}

/** Creates an <li> element containing text. */
function createListElement(text) {
  const liElement = document.createElement('li');
  liElement.innerText = text;
  return liElement;
}

/** Tells the server to delete the task. */
function deleteComment(comment) {
  const params = new URLSearchParams();
  params.append('id', comment.id);
  fetch('/delete-comment', {method: 'POST', body: params});
}

// /** Creates a map and adds it to the page. */
// function createMap() {
//   const map = new google.maps.Map(
//       document.getElementById('map'),
//       {center: {lat: 37.422, lng: -122.084}, zoom: 16});
// }