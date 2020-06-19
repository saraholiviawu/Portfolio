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
    checkLogin();
    createMapFunction();
}

var currUserEmail = "";
// Function checks whether user is logged in when body loads
function checkLogin() {
  fetch('/login')
  .then(response => response.json()) // parses the response as JSON
  .then((userInfo) => { // now we can reference the fields in myObject!
    const loginWrapperElement = document.getElementById('login-link');
    loginWrapperElement.innerHTML = "";
    var loginLinkPretext = document.getElementById('login-link-pretext');
    if (userInfo.isUserLoggedIn == true) {
      // If user is logged in, provide a log out URl underneath the comment form
      currUserEmail = userInfo.currUserEmail;
      loginLinkPretext.innerText = "Not " + currUserEmail + "? "
      loginWrapperElement.innerText = 'Log out';
      loginWrapperElement.href = userInfo.logoutUrl;
      document.getElementById('user-form').style.display = "block";
      commentFunction(5);
    } else {
      loginLinkPretext.innerText = "Can't see the form? "
      loginWrapperElement.innerText = 'Log in';
      loginWrapperElement.href = userInfo.loginUrl;
      document.getElementById('user-form').style.display = "none";
      commentFunction(5);
    }
    return loginWrapperElement;
  });
}

function commentFunction(numberOfCommentsToShow) {
  if (typeof numberOfCommentsToShow === 'number') {
      numberOfCommentsToShow = numberOfCommentsToShow.toString();
  }

  // Clear out existing children
  document.getElementById('history').innerHTML = "";

  // If user is logged in
  fetch('/data?show-comments='+numberOfCommentsToShow)  //
  .then(response => response.json()) // parses the response as JSON
  .then((comments) => { // now we can reference the fields in myObject!
    const commentListElement = document.getElementById('history');
    comments.forEach((comment) => {
        commentListElement.appendChild(createCommentElement(comment, currUserEmail));
        createMapFunction.callGeocodeAddress(comment.address, comment.name, comment.text);
    });
  });
}

// Create a comment element
function createCommentElement(comment, currUserEmail) {
  const commentElement = document.createElement('li');
  commentElement.className = 'comment';

  const textSpanElement = document.createElement('span');
  const buttonTextSpanElement = document.createElement('span');

  const nameElement = document.createElement('h4');
  nameElement.innerText = comment.name;
  textSpanElement.append(nameElement);

  const addressElement = document.createElement('p');
  addressElement.innerText = comment.address;
  textSpanElement.append(addressElement);

  buttonTextSpanElement.append(textSpanElement);

  if (currUserEmail == comment.email) {
    const deleteButtonElement = document.createElement('button');
    deleteButtonElement.innerText = 'Delete';
    deleteButtonElement.addEventListener('click', () => {
    deleteComment(comment);
    // Remove the task from the DOM.
      commentElement.remove();
    });
    buttonTextSpanElement.appendChild(deleteButtonElement);
  }
  

  const textElement = document.createElement('p');
  textElement.innerText = comment.text;

  commentElement.appendChild(buttonTextSpanElement);
  commentElement.appendChild(textElement);
  
  return commentElement;
}

// Tells the server to delete the task.
function deleteComment(comment) {
  const params = new URLSearchParams();
  params.append('id', comment.id);
  fetch('/delete-comment', {method: 'POST', body: params});
}