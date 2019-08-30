var once;
var twice;
var always;

chrome.extension.getBackgroundPage().console.log("Loading Video Selector");

function logVars(){
    chrome.extension.getBackgroundPage().console.log("once", once);
    chrome.extension.getBackgroundPage().console.log("twice", twice);
    chrome.extension.getBackgroundPage().console.log("always", always);
}
logVars();

function getVarsFromStorage(){
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
}
getVarsFromStorage();

function putVarsToStorage(){
  chrome.storage.sync.set({once: once, twice: twice, always: always});
}

function setOnce(one){
  chrome.extension.getBackgroundPage().console.log("setOnce", one);
  chrome.storage.sync.set({once: one});
  once = one;
}

function setAlways(alway){
  chrome.extension.getBackgroundPage().console.log("setAlways", alway);
  chrome.storage.sync.set({always: alway});
  always = alway;
}

function genericOnClick(info) {
  // chrome.extension.getBackgroundPage().console.log("item " + info.menuItemId + " was clicked");
  chrome.extension.getBackgroundPage().console.log(info);
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({"title": "Invidious", "type": "radio", "contexts":["page_action"], id: "i",
    "onclick": function(e){genericOnClick(e); setAlways("invidious");} });
  chrome.contextMenus.create({"title": "Hooktube", "type": "radio", "contexts":["page_action"], id: "h",
    "onclick": function(e){genericOnClick(e); setAlways("hooktube");} });
  chrome.contextMenus.create({"title": "Youtube", "type": "radio", "contexts":["page_action"], id: "y",
    "onclick": function(e){genericOnClick(e); setAlways("youtube");} });
});

chrome.storage.onChanged.addListener(function(list, sync) {
  chrome.extension.getBackgroundPage().console.log(list);
  if (typeof list.once !== "undefined") {
    if (typeof list.once.newValue !== "undefined") {
      // once = list.once.newValue;
      /*if (window.location.href.indexOf(/(((you|hook)tube\.com)|(youtu\.be)|(invidio\.us))\/.+/) != -1) {*/
      // window.location.reload();
    }
  }
  if (typeof list.always !== "undefined") {
    if (typeof list.always.newValue !== "undefined") {
      // always = list.always.newValue;
      // window.location.reload();
    }
  }
  console.log(list);
  chrome.extension.getBackgroundPage().console.log("Storage changed", list);
});
  

chrome.webRequest.onBeforeRequest.addListener((details) => {
  logVars();
  chrome.extension.getBackgroundPage().console.log(details);
  const youtubeRegex = /youtube.com(\/?.*)/;
  const youtubeShortRegex = /youtu.be(\/?.*)/;
  const hooktubeRegex = /hooktube\.com(\/?.*)/;
  const invidiousRegex = /invidio\.us(\/?.*)/;
  const anyRegex = /(youtube\.com|youtu\.be|hooktube\.com|invidio\.us)(\/?.*)/;

  if (typeof once !== "undefined" && once !== false) {
    once = false;
    twice = true;
    putVarsToStorage();

    if ( once === "hooktube" ){
      return {redirectUrl: 'https://hooktube.com' + anyRegex.exec(details.url)[1]};
    } else if (once === "invidious") {
      return {redirectUrl: 'https://invidio.us' + anyRegex.exec(details.url)[1]};
    } else if ( once === "youtube" ) {
      return {redirectUrl: 'https://youtube.com' + anyRegex.exec(details.url)[1]};
    }
  } else if (typeof twice !== "undefined" && twice === true) {
    twice = false;
    putVarsToStorage();
  } else {
    if (typeof always !== "undefined" && always !== false) {
      if (always === "youtube") {
        if (hooktubeRegex.test(details.url) === true) {
          return {redirectUrl: 'https://www.youtube.com' + hooktubeRegex.exec(details.url)[1]};
        } else if ( invidiousRegex.test(details.url) === true) {
          return {redirectUrl: 'https://www.youtube.com' + invidiousRegex.exec(details.url)[1]};
        }
      } else if ( always === "hooktube" ) {
        if (youtubeRegex.test(details.url) === true) {
          return {redirectUrl: 'https://hooktube.com' + youtubeRegex.exec(details.url)[1]};
        } else if ( invidiousRegex.test(details.url) === true) {
          return {redirectUrl: 'https://hooktube.com' + invidiousRegex.exec(details.url)[1]};
        }
      } else if ( always === "invidious" ) {
        if (youtubeRegex.test(details.url) === true) {
          return {redirectUrl: 'https://invidio.us' + youtubeRegex.exec(details.url)[1]};
        } else if (hooktubeRegex.test(details.url) === true) {
          return {redirectUrl: 'https://invidio.us' + hooktubeRegex.exec(details.url)[1]};
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
