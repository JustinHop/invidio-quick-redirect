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

var once;
var twice;
var always;

chrome.storage.sync.get(function(list) {
  if(typeof list.once !== "undefined") {
    once = list.once;
  } else {
    once = false;
  }
  if(typeof list.twice !== "undefined") {
    once = list.twice;
  } else {
    twice = false;
  }
  if(typeof list.always !== "undefined") {
    always = list.always;
  } else {
    always = "invidious";
  }
});

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({"title": "Hooktube Once", "contexts":["page_action"],
    "onclick": chrome.storage.sync.set({once: "hooktube"}) });
  chrome.contextMenus.create({"title": "Invidious Once", "contexts":["page_action"],
    "onclick": chrome.storage.sync.set({once: "invidious"}) });
  chrome.contextMenus.create({"title": "Youtube Once", "contexts":["page_action"],
    "onclick": chrome.storage.sync.set({once: "youtube"}) });

  chrome.contextMenus.create({"title": "Hooktube Always", "type": "radio", "contexts":["page_action"],
    "onclick": chrome.storage.sync.set({always: "hooktube"}) });
  chrome.contextMenus.create({"title": "Invidious Always", "type": "radio", "contexts":["page_action"],
    "onclick": chrome.storage.sync.set({always: "invidious"}) });
  chrome.contextMenus.create({"title": "Youtube Always", "type": "radio", "contexts":["page_action"],
    "onclick": chrome.storage.sync.set({always: "youtube"}) });
});

chrome.storage.onChanged.addListener(function(list, sync) {
  if (typeof list.once !== "undefined") {
    if (typeof list.once.newValue !== "undefined") {
      once = list.once.newValue;
      if (window.location.href.indexOf(/(((you|hook)tube\.com)|(youtu\.be)|(invidio\.us))\/.+/) != -1) {
        window.location.reload();
      }
    }
  }
  if (typeof list.always !== "undefined") {
    if (typeof list.always.newValue !== "undefined") {
      always = list.always.newValue;
    }
  }
});

chrome.webRequest.onBeforeRequest.addListener((details) => {
  const youtubeRegex = /youtube.com(\/?.*)/;
  const youtubeShortRegex = /youtu.be(\/?.*)/;
  const hooktubeRegex = /hooktube\.com(\/?.*)/;
  const invidiousRegex = /invidio\.us(\/?.*)/;
  const anyRegex = /(youtube\.com|youtu\.be|hooktube\.com|invidio\.us)(\/?.*)/;

  if (typeof once !== "undefined" && once !== false) {
    once = false;
    twice = true;

    if ( once === "hooktube" ){
      return {redirectUrl: 'https://hooktube.com' + anyRegex.exec(details.url)[1]};
    } else if (once === "invidious") {
      return {redirectUrl: 'https://invidio.us' + anyRegex.exec(details.url)[1]};
    } else if ( once === "youtube" ) {
      return {redirectUrl: 'https://invidio.us' + anyRegex.exec(details.url)[1]};
    }
  }

  if (typeof twice !== "undefined" && twice === true) {
    twice = false;
  } else {
    if (always) {
      if (always === "youtube") {
        if (hooktubeRegex.test(details.url) === true) {
          return {redirectUrl: 'https://www.youtube.com' + hooktubeRegex.exec(details.url)[1]};
        } else if ( invidiousRegex.test(details.url) === true) {
          return {redirectUrl: 'https://invidio.us' + invidiousRegex.exec(details.url)[1]};
        }
      } else if ( always === "hooktube" ) {
        if (youtubeRegex.test(details.url) === true) {
          return {redirectUrl: 'https://www.hooktube.com' + youtubeRegex.exec(details.url)[1]};
        } else if ( invidiousRegex.test(details.url) === true) {
          return {redirectUrl: 'https://invidio.us' + invidiousRegex.exec(details.url)[1]};
        }
      } else if ( always === "invidious" ) {
        if (youtubeRegex.test(details.url) === true) {
          return {redirectUrl: 'https://www.hooktube.com' + youtubeRegex.exec(details.url)[1]};
        } else if (hooktubeRegex.test(details.url) === true) {
          return {redirectUrl: 'https://www.youtube.com' + hooktubeRegex.exec(details.url)[1]};
        }
      }
    }
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
