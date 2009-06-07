getUrl();

window.addEventListener("focus", getUrl);

function getUrl() {
  if(window == top) {
    chrome.extension.connect().postMessage(
    { 
      "url" : window.location.href,
      "title" : window.document.title
    });
  }
}