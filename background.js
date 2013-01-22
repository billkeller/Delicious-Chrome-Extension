chrome.browserAction.onClicked.addListener(function(tab) {
		chrome.extension.getBackgroundPage().getSelection(addDeliciousFromPopup);
});

function addDeliciousFromPopup(text){
	chrome.tabs.query({
			active: true,                              // Select active tabs
			windowId: chrome.windows.WINDOW_ID_CURRENT, // In the current window

		}, function(array_of_Tabs) {
			// Since there can only be one active tab in one active window, 
			//  the array has only one element
			var tab = array_of_Tabs[0],
				url = tab.url,
				title = tab.title,
				notes = text,
				notesMaxLength = 1000;
			if (notes && notes.length > notesMaxLength) {
				notes = notes.substring(0, notesMaxLength - 1);
			}					
			
			addDelicious({
				url: url,
				title: title,
				notes: notes
			});
		});
};

chrome.webRequest.onCompleted.addListener(
	function(details){
		// We're only here IF the XHR request is the URL found under filters
		// console.log("resource", details.url);
		// we also need to make sure this is OUR popup, as opposed to the live delicious.com
		chrome.tabs.query({
			active: true,                              // Select active tabs
			windowId: chrome.windows.WINDOW_ID_CURRENT, // In the current window

		}, function(array_of_Tabs) {
			// Since there can only be one active tab in one active window, 
			//  the array has only one element
			var tab = array_of_Tabs[0],
				url = tab.url,
				title = tab.title,
				tabId = tab.id,
				windowId = chrome.windows.WINDOW_ID_CURRENT;
			checkPopup(tab,url,tabId,windowId);
		});		
	},
	// filters
	{
		urls:[
			"*://*.delicious.com/api/v1/posts/addoredit*",
			"*://*.delicious.com/api/v1/posts/delete*"
		]
	}
);

function checkPopup(tab,url,tabId) {
	// console.log('from Delicious Tools popup, ourWindow id: ' + ourWindow + ', our popupId:' + tabId);
	if (ourWindow == tabId){
		// console.log('this is our popup, so it\'s safe to close')
		chrome.tabs.remove(tabId);
	};
};

function getOurWindow(){
	chrome.tabs.getSelected(window.id,
		function (response){
			ourWindow = response.id
			// console.log('The window Delicious Tools created has an id of: ' + ourWindow);
		});
};

chrome.extension.onRequest.addListener(
	function(message, sender, sendResponse) {
		if (message.action && sender.tab) {
			switch (message.action) {
				case 'getFromLocalStorage':
					// console.log(message.variableName + ': ' + localStorage [message.variableName]);
					if (localStorage[message.variableName] !== null) {
						sendResponse(localStorage[message.variableName]);
					}
					break;
			}
		}
	}
);

var selection_callbacks = [];
function getSelection(callback) {
	selection_callbacks.push(callback);
	chrome.tabs.executeScript(null, { file: "getSelection.js" });
};

chrome.extension.onRequest.addListener(function (request) {
	// this listener is activated be it from shortcut or be it from popup
	var callback = selection_callbacks.shift();
	// console.log(callback);
	// only our addDeliciousFromPopup needs this, otherwise it's undefined
	// There's probably a better way to do this...
	if (typeof callback != 'undefined') {
		callback(request);
	}
});

// Main request listener
chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		// console.log('listening');
		if (request.type === 'addDelicious') {
			addDelicious(request);
		}
	}
);

// Show delicious pop-up window
addDelicious = function(conf) {
	var c = conf || {},
		doc = c.document || document,
		url = c.url || doc.location,
		title = c.title || doc.title,
		notes = c.notes || '',
		w = c.width || 500,
		h = c.height || 430,
		deliciousUrl = c.deliciousUrl || "http://delicious.com/save?url=",
		fullUrl;

	fullUrl = deliciousUrl + encodeURIComponent(url) + '&title=' + encodeURIComponent(title) + '&note=' + encodeURIComponent(notes) + '&v=1.1';
	// Chrome's API for creating windows (rather than simple window.open)
	chrome.windows.create({
		url: fullUrl,
		width: w,
		height: h,
		type: 'popup'
		}, function() {
			chrome.windows.getCurrent(function(window) {
				getOurWindow();
			});				
	});
	
};
