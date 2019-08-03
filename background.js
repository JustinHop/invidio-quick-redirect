chrome.webRequest.onBeforeRequest.addListener((details) => {
  const youtubeRegex = /youtube.com(\/?.*)/;
  const youtubeShortRegex = /youtu.be\/.+/;

  if (youtubeRegex.test(details.url) === true) {
    return {redirectUrl: 'https://invidio.us' + youtubeRegex.exec(details.url)[1]};
  } else if (youtubeShortRegex.test(details.url) === true) {
    const youtubeShortCaptureRegex = /youtu.be\/(.+)/;
    return {redirectUrl: 'https://invidio.us/watch?v=' + youtubeShortCaptureRegex.exec(details.url)[1]};
  } else {
    return {redirectUrl: 'https://invidio.us'};
  }
},
{
  urls: [
    '*://*.youtube.com/watch*',
    '*://*.youtu.be/watch*'
  ],
  types: [
    'main_frame',
    'sub_frame'
  ]
},
['blocking']);
