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
   console.log(item);
   if (item.yes_no == true) {
      changeBio();
      changeTweet();
      changeAvi();
      changeToReport();
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
  userID = document.querySelector(".ProfileHeaderCard-nameLink").innerText;

  var originalDiv = document.getElementsByClassName("ProfileHeaderCard-screenname");

  if (! document.getElementById("bio-box")) {

    // Parent Element
    var biobox = document.createElement("DIV");
    originalDiv[0].appendChild(biobox);
    biobox.id = "bio-box";

      // Title
      var biobox_title = document.createElement("DIV");
      biobox.appendChild(biobox_title);
      biobox_title.id = "bio-box-title";
      biobox_title.innerText = "Twitter Profile Identifier";

      // Title Image
      var logo = document.createElement("IMG");
      logo.setAttribute("src", "chrome-extension://pldpfpfcdmnmdellocecpejmgpimfppj/icon.png");
      logo.setAttribute("id", "bio-box-img");
      biobox.append(logo);

      // Box
      var charbox = document.createElement("DIV");
      biobox.appendChild(charbox);
      charbox.id = "char-box";

        // Prompt Abusive_toggle
        var biobox_char = document.createElement("P");
        charbox.appendChild(biobox_char);
        biobox_char.id = "bio-box-text";
        biobox_char.innerText = "This user is";

        // Abusive Toggle
        var biobox_char_toggle = document.createElement("P");
        biobox_char.appendChild(biobox_char_toggle);
        biobox_char_toggle.id = "bio-box-highlight";
        biobox_char_toggle.innerText = "Abusive";

        // Prompt Abusive_words
        var biobox_word = document.createElement("P");
        charbox.appendChild(biobox_word);
        biobox_word.id = "bio-box-text";
        biobox_word.innerText = "Top 5 Abusive Words";

        // Abusive_words
        var biobox_word_items = document.createElement("P");
        biobox_word.appendChild(biobox_word_items);
        biobox_word_items.id = "bio-box-highlight";
        biobox_word_items.innerText = "Something";

    var bio1 = document.getElementsByClassName("ProfileHeaderCard-bio");
    var bio2 = document.getElementsByClassName("ProfileHeaderCard-location");
    var bio3 = document.getElementsByClassName("ProfileHeaderCard-url");
    var bio4 = document.getElementsByClassName("ProfileHeaderCard-joinDate");
    var bio5 = document.getElementsByClassName("ProfileHeaderCard-birthdate");
    var bio6 = document.getElementsByClassName("ProfileMessagingActions");

    bio1[0].setAttribute("class", "u-hidden");
    bio2[0].setAttribute("class", "u-hidden");
    bio3[0].setAttribute("class", "u-hidden");
    bio4[0].setAttribute("class", "u-hidden");
    bio5[0].setAttribute("class", "u-hidden");
    bio6[0].setAttribute("style", "margin-top:0px;");
  }
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
  clone.src = "chrome-extension://${chrome.runtime.id}/bad-mouth.png";                  //If you are using a local image remember to update the permissions in the manifest
  container.appendChild(clone);
}
// Note: Currently, these run everyewhere, in timeline and on profile page
function changeTweet(){
  let Btn = document.getElementsByClassName("NewTweetButton");
  Btn[0].setAttribute("style", "background-color:#eb3b5a;");

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
  if (msgBtn.length){
    msgBtn[0].innerHTML = "Whisper to this user";
  };

}

function moralize() {
  let t = setTimeout(function() {
    if (document.querySelector(".tweet-box > div")){
      document.querySelector(".tweet-box > div").innerHTML = "@" + userID + " My extension says you are abusive. Please stop.";
      clearTimeout(t);
    }

  }, 1000);
};
