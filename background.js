/*
 * use this if I decide to go page action style
chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlMatches: '(((you|hook)tube\.com)|(youtu.be)|(invidio.us))\/' },
          })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});
*/

function genericOnClick(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
}

var contexts = ["page","video","page_action","browser_action"];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var title = "VideoPlayerSelect '" + context + "' menu item";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
    "onclick": genericOnClick});
  console.log("'" + context + "' item:" + id);
}

chrome.webRequest.onBeforeRequest.addListener((details) => {
  const youtubeRegex = /youtube.com(\/?.*)/;
  const youtubeShortRegex = /youtu.be(\/?.*)/;
  const hooktubeRegex = /hooktube\.com(\/?.*)/;
  const invidiousRegex = /invidio\.us(\/?.*)/;

  if (youtubeRegex.test(details.url) === true) {
    return {redirectUrl: 'https://invidio.us' + youtubeRegex.exec(details.url)[1]};
  } else if (youtubeShortRegex.test(details.url) === true) {
    return {redirectUrl: 'https://invidio.us/' + youtubeShortRegex.exec(details.url)[1]};
  } else {
    /*return {redirectUrl: 'https://invidio.us'};*/
  }
},
{
  urls: [
    '*://*.youtube.com/watch*',
    '*://*.youtu.be/watch*',
    '*://hooktube.com/watch*',
    '*://invidio.us/watch*'
  ],
  types: [
    'main_frame',
    'sub_frame'
  ]
},
['blocking']);
