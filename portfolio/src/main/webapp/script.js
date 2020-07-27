// Copyright 2020 Google LLC
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

function changeGridColumnsNumber(columns_number) {
    var flex_value;
    var pictures = document.getElementsByClassName("grid-column");

    if (columns_number === 1) {
      flex_value = "100%";
    } else {
      if (columns_number === 2) {
        flex_value = "50%";
      } else {
        flex_value = "25%";
      }
    }

    for (var i = 0; i < pictures.length; i++) {
        pictures[i].style.msFlex = flex_value;
        pictures[i].style.flex = flex_value;
  }
}

/** Fetches comments from the server and adds them to the DOM. */
function loadComments() {
  checkLogIn();
  
  var commentsNumber = document.getElementById("select-number").value;
  var url = `/list-comments?commentsNumber=${commentsNumber}`;
  const commentsContainer = document.getElementById('container');

  fetch(url).then(response => response.json()).then((comments) => {
    commentsContainer.innerHTML = "";
    comments.forEach((comment) => {
      commentsContainer.appendChild(createCommentElement(comment));
    })
    if(commentsContainer.innerHTML === "")
      commentsContainer.innerHTML = "No comments available";
  });
}

/** Creates an element that represents a comment. */
function createCommentElement(comment) {
  const commentElement = document.createElement('div');
  commentElement.className = 'comment-box';

  const textElement = document.createElement('span');
  textElement.innerText = comment.text;
  
  // Add signature.
  const userEmail = document.createElement('p');
  userEmail.innerText = comment.email;
  userEmail.style.textAlign = "right";
  
  // Create a separation bar after a comment.
  const separationBar = document.createElement('hr');

  // Add text and bar to the comment element.
  commentElement.appendChild(textElement);
  commentElement.appendChild(userEmail);
  commentElement.appendChild(separationBar);

  return commentElement;
}

/** Tells the server to delete all comments. */
async function deleteAllComments() {
  await fetch('/delete-comments', {method: 'POST'});
  loadComments();
}

//** Checks login status and display HTML elements accordingly. */
async function checkLogIn () {
  const response = await fetch('/login');
  const loginInfo = await response.json();
  const key = Object.keys(loginInfo)[0];
  
  // Add button for login/logout.
  const link = document.createElement('a');
  link.href = loginInfo[key];
  const linkButton = document.createElement('button');
  linkButton.style.borderColor = "red";
  link.appendChild(linkButton);

  // User is logged in.
  if (key == "1") {
    document.getElementById("comments-form").style.display = "block";

    linkButton.innerText = "LOGOUT";
    document.getElementById("black-bar").appendChild(link);
  // User is not logged in.
  } else {
    document.getElementById("comments-form").style.display = "none";

    linkButton.innerText = "Login to leave a comment";
    document.getElementById("submit-comment").appendChild(link);
  }
}
