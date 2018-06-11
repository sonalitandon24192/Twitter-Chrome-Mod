var jsChecktimer = setInterval(checkForJS_Finish, 200);
var userID;

function get_score(username, callback) {
  var url = "https://pumpkin-shortcake-65417.herokuapp.com/tpi?user=" + username + "&numberTwit=200";
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      callback(request.responseText); // Another callback here
    }
  };
  request.open('GET', url);
  request.send();
}

window.onscroll = function(ev) {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    // you're at the bottom of the page
    if (item.yes_no)
      highlightAbusivePosts(abusive_list);
  }
};

function checkabusive(data) {
  item = JSON.parse(data);
  console.log(item);
  if (item.yes_no == true) {
    abusive_list = item.word_list.map(function(d) {
      return d.word
    })
    changeBio(abusive_list);
    //      changeTweet();
    changeAvi();
    //      changeToReport();
    highlightAbusivePosts(abusive_list);
  } else {
    console.log("this is a nice person");
  }
}

function get_score_notif(userIDNode) {
  var url = "https://pumpkin-shortcake-65417.herokuapp.com/tpi?user=" + userIDNode.innerText + "&numberTwit=200";
  console.log(url);
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      let stranger_item = JSON.parse(request.responseText);
      console.log(stranger_item.yes_no);
      if (stranger_item.yes_no == true) {
        changeNameHeader(userIDNode);
      }
    }
  };
  request.open('GET', url);
  request.send();

}

///////////////////////////////////


function findUserId(document) {
  let userID = document.querySelector(".u-linkComplex-target");
  return userID.innerText;
}

function checkNotifUserId(document) {
  let container = document.querySelector(".stream");
  let items = container.querySelectorAll(".account-group");
  items.forEach(function(element) {
    let userIDNode = element.querySelector(".account-group .username > b");
    if (!stranger_list.includes(userIDNode.innerText)) {
      stranger_list.push(userIDNode.innerText);
      console.log(userIDNode.innerText);
      get_score_notif(userIDNode);
    }
  });
}

function highlightAbusivePosts(abusive_list) {

  var alltweets = document.querySelectorAll(".tweet-text");
  for (i = 0; i < alltweets.length; i++) {
    var tweet = alltweets[i].innerText.toLowerCase();
    for (j = 0; j < abusive_list.length; j++) {
      var reg = new RegExp("\\b" + abusive_list[j] + "\\b", 'i')
      if (reg.test(tweet)) {
        tweet = tweet.replace(abusive_list[j], "<span style=color:#002DFF;>" + abusive_list[j] + "</span>");
        alltweets[i].innerHTML = tweet;
        alltweets[i].style.backgroundColor = "#FCB0AC";
      }
    }
  }
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    let userId = findUserId(document);
    console.log(userId)
    if (userId) {}
    return true;
  });



function checkForJS_Finish() {
  if (document.querySelector(".ProfileHeaderCard-bio")) {
    if (document.querySelector(".u-linkComplex-target").innerText != userID) {
      //send get request
      userID = findUserId(document);
      get_score(userID, checkabusive);
      // changeBio();
      // changeTweet();
      // changeToReport();
    }
  }
  if (document.querySelector(".NotificationsHeadingContent")) {
      checkNotifUserId(document);
  }
}

function changeBio(abusive_list) {
  userID = document.querySelector(".ProfileHeaderCard-nameLink").innerText;

  var originalDiv = document.getElementsByClassName("ProfileHeaderCard-screenname");

  if (!document.getElementById("bio-box")) {

    // Parent Element
    var biobox = document.createElement("DIV");
    originalDiv[0].appendChild(biobox);
    biobox.id = "bio-box";

    // Title
    var biobox_title = document.createElement("DIV");
    biobox.appendChild(biobox_title);
    biobox_title.id = "bio-box-title";
    biobox_title.innerText = "Tweety Holmes";

    // Title Image
    var logo = document.createElement("IMG");
    logo.src = `chrome-extension://${chrome.runtime.id}/icon.png`;
    //  logo.setAttribute("src", "chrome-extension://" + ${chrome.runtime.id} + "/icon.png");
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
    biobox_word.innerText = "Few Abusive Words Used";

    // Abusive_words
    var biobox_word_items = document.createElement("P");
    biobox_word.appendChild(biobox_word_items);
    biobox_word_items.id = "bio-box-highlight";
    var abusiveWordsToDisplay = "";
    if (abusive_list.length >= 7) {
      for (i = 0; i < 7; i++)
        abusiveWordsToDisplay = abusiveWordsToDisplay + abusive_list[i] + " ";
    } else {
      for (i = 0; i < abusive_list.length; i++)
        abusiveWordsToDisplay = abusiveWordsToDisplay + abusive_list[i] + " ";
    }
    biobox_word_items.innerText = abusiveWordsToDisplay;

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
  followBtn[0].style.display = "none";
  //followingBtn[0].style.display="none";
  //unfollowBtn[0].style.display="inline";
  followBtn[0].innerText = "Report";
  followBtn[0].classList.add("report-text");
}
//Add image overlay to user profile picture
function changeAvi() {
  let avi = document.getElementsByClassName("ProfileAvatar-image");                   //Get current avatar if you want to modify it at all
  var clone = document.createElement("img");                                          // Create image that will be the overlay
  let avi = document.getElementsByClassName("ProfileAvatar-image"); //Get current avatar if you want to modify it at all
  var clone = document.createElement("img"); // Create image that will be the overlay
  clone.classList.add("ProfileAvatar-image");
  clone.src = `chrome-extension://${chrome.runtime.id}/bad-mouth.png`; //If you are using a local image remember to update the permissions in the manifest
  container.appendChild(clone);
}
// Note: Currently, these run everyewhere, in timeline and on profile page
function changeTweet() {
  let Btn = document.getElementsByClassName("NewTweetButton");
  Btn[0].setAttribute("style", "background-color:#eb3b5a;");

  let actionBtns = document.getElementsByClassName("ProfileMessagingActions-buttonWrapper");
  if (actionBtns.length > 1) {
    for (let btn of actionBtns) {
      btn.classList.add("u-sizeFull");
    }
  }
  let tweetBtn = document.getElementsByClassName("NewTweetButton-text");
  tweetBtn[0].innerHTML = "Moralize this user";
  tweetBtn[0].addEventListener('click', moralize);
  var privateMessageButton = document.getElementsByClassName("DMButton u-sizeFull u-textTruncate js-tooltip EdgeButton EdgeButton--primary");
  console.log(privateMessageButton);
  if (privateMessageButton.length != 0) {
    let msgBtn = document.getElementsByClassName("DMButton-text");
    if (msgBtn.length) {
      msgBtn[0].innerHTML = "Whisper to this user";
    };
    privateMessageButton[0].style.backgroundColor = "#eb3b5a";
  }
}

function changeNameHeader(userIDNode) {
  userIDNode.innerText += " <- This user is potentially abusive"
}

function moralize() {
  let t = setTimeout(function() {
    if (document.querySelector(".tweet-box > div")) {
      document.querySelector(".tweet-box > div").innerHTML = item.tweet_content;
      clearTimeout(t);
    }

  }, 1000);
};
