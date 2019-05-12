// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
chrome.runtime.onInstalled.addListener(
  function() {
    console.log("onInstalled!");
  }
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);
  // const popup = chrome.browserAction.getPopup();

  // console.log(popup);
  // const p = popup.document.createTextNode("hello #1");
  // popup.document.body.appendChild(p);

  chrome.browserAction.setPopup({popup: "../browser_action/browser_action.html"});

  sendResponse(1);
});