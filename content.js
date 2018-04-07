var jsChecktimer = setInterval(checkForJS_Finish, 500);
var userID;

function get_score(username, callback) {
    var url = "https://pumpkin-shortcake-65417.herokuapp.com/tpi?user="+username+"&numberTwit=200";
    var request = new XMLHttpRequest();
    request.onreadystatechange = function()
    {
        if (request.readyState == 4 && request.status == 200)
        {
            callback(request.responseText); // Another callback here
        }
    };
    request.open('GET', url);
    request.send();
}

function checkabusive(data) {
   var item= JSON.parse(data);
   if (item.abusive_user == true) {
      changeBio();
      changeTweet();
   }
   else {
     console.log("this is a nice person");
   }
}

///////////////////////////////////


function findUserId(document) {
  let userId = document.querySelector(".ProfileHeaderCard-screennameLink > span > b");
  return userId.innerText;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    let userId = findUserId(document);
    console.log(userId)
    if (userId) {
    }
    return true;
  });



function checkForJS_Finish() {
  if (document.querySelector(".ProfileHeaderCard-bio")
  ) {
    if (document.querySelector(".ProfileHeaderCard-screennameLink > span > b").innerText != userID){
      //send get request
      userID = findUserId(document);
      get_score(userID, checkabusive);
      // changeBio();
      // changeTweet();
      // changeToReport();
    }

  }
}

function changeBio(){
  let bio = document.getElementsByClassName("ProfileHeaderCard-bio");
  bio[0].innerText = "This is a pretty girl";
  //userID = document.querySelector(".ProfileHeaderCard-screennameLink > span > b").innerText;
}

function changeToReport() {
  console.log("testing");
  let followBtn = document.getElementsByClassName("EdgeButton EdgeButton--secondary EdgeButton--medium button-text follow-text");
  let followingBtn = document.getElementsByClassName("EdgeButton EdgeButton--primary EdgeButton--medium button-text following-text");
  let unfollowBtn = document.getElementsByClassName("EdgeButton EdgeButton--danger EdgeButton--medium button-text unfollow-text");
  followBtn[0].style.display="none";
  //followingBtn[0].style.display="none";
  //unfollowBtn[0].style.display="inline";
  followBtn[0].innerText = "Report";
  followBtn[0].classList.add("report-text");
}
//Add image overlay to user profile picture
function changeAvi() {
  let container = document.getElementsByClassName("ProfileAvatar-container")[0];      //Get parent of Profile Avatar
  let avi = document.getElementsByClassName("ProfileAvatar-image");                   //Get current avatar if you want to modify it at all
  var clone = document.createElement("img");                                          // Create image that will be the overlay
  clone.classList.add("ProfileAvatar-image");
  clone.src=`chrome-extension://${chrome.runtime.id}/bad-mouth.png`;                  //If you are using a local image remember to update the permissions in the manifest
  container.appendChild(clone);
}
// Note: Currently, these run everyewhere, in timeline and on profile page
function changeTweet(){
  let actionBtns = document.getElementsByClassName("ProfileMessagingActions-buttonWrapper");
  if(actionBtns.length > 1){
    for (let btn of actionBtns){
      btn.classList.add("u-sizeFull");
    }
  }
  let tweetBtn = document.getElementsByClassName("NewTweetButton-text");
  tweetBtn[0].innerHTML = "Moralize this user";
  tweetBtn[0].addEventListener('click', moralize);
  let msgBtn = document.getElementsByClassName("DMButton-text");
  msgBtn[0].innerHTML = "Whisper to this user";

}

function moralize() {
  let t = setTimeout(function() {
    if (document.querySelector(".tweet-box > div")){
      document.querySelector(".tweet-box > div").innerHTML = "@" + userID + " My extension says you are abusive. Please stop.";
      clearTimeout(t);
    }

  }, 1000);
};
