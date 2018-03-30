
function findUserId(document) {
  var userId = document.querySelector(".ProfileHeaderCard-screennameLink > span > b");
  return userId.innerText;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    let userId = findUserId(document);
    if (userId) {
      sendResponse({data: userId});
    }
    return true;
  });

  var userID = document.querySelector(".ProfileHeaderCard-screennameLink > span > b").innerText;
  var bio = document.getElementsByClassName("ProfileHeaderCard-bio");
  bio[0].innerText = "This is a pretty girl";

  document.getElementById("global-new-tweet-button").click();
  setTimeout(function() {
      document.querySelector(".tweet-box > div").innerHTML = "@" + userID + " My extension says you are abusive. Please stop.";
    }, 2000);
