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
      changeToReport();
    }

  }
}

function changeBio(){
  let bio = document.getElementsByClassName("ProfileHeaderCard-bio");
  bio[0].innerText = "This is a pretty girl";
  userID = document.querySelector(".ProfileHeaderCard-screennameLink > span > b").innerText;
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
// Note: Currently, these run everyewhere, in timeline and on profile page
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
