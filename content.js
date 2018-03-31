function findUserId(document) {
  var userId = document.querySelector(".ProfileHeaderCard-screennameLink > span > b");
  return userId.innerText;
}

var jsChecktimer = setInterval(checkForJS_Finish, 5000);
var userID;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    let userId = findUserId(document);
    if (userId) {
      sendResponse({
        data: userId
      });
    }
    return true;
  });


function checkForJS_Finish() {
  if (document.querySelector(".ProfileHeaderCard-bio")
  ) {
    if (document.querySelector(".ProfileHeaderCard-screennameLink > span > b").innerText != userID){
      changeBio();
      changeTweet();
    }

  }
}

function changeBio(){
  let bio = document.getElementsByClassName("ProfileHeaderCard-bio");
  bio[0].innerText = "This is a pretty girl";
  userID = document.querySelector(".ProfileHeaderCard-screennameLink > span > b").innerText;
}

function changeTweet(){
  let tweetBtn = document.getElementById("global-new-tweet-button");
  tweetBtn.innerHTML = "Moralize this user";
  tweetBtn.addEventListener('click', moralize);
}

function moralize() {
  let t = setTimeout(function() {
    if (document.querySelector(".tweet-box > div")){
      document.querySelector(".tweet-box > div").innerHTML = "@" + userID + " My extension says you are abusive. Please stop.";
      clearTimeout(t);
    }

  }, 1000);
};
