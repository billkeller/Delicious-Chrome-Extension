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


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	
	if(changeInfo.status == "loading") {
	
		chrome.windows.getCurrent(function(w) {
			chrome.tabs.getSelected(w.id,
			function (response){
				// alert('ourWindow: ' + ourWindow);
				// alert('response id: '+ response.id);
				if(response.id == ourWindow) {
					// You're here because this is the ID of the popup window our extension created
					// alert('Found this puppy');
		
					if (typeof String.prototype.startsWith != 'function') {
					  String.prototype.startsWith = function (str){
						return this.slice(0, str.length) == str;
					  };
					}      
			
					var data = tab.url
					var tldURL = 'http://delicious.com'
					var saveURL = 'http://delicious.com/save?'
					var registerURL = 'http://delicious.com/register'
					var loginURL = 'http://delicious.com/login'
					if(data.startsWith(saveURL) || data.startsWith(registerURL) || data.startsWith(loginURL)) {
						// alert('Do not close our window');
						if(data.startsWith(registerURL)) {
							// If it's the register page, push them to the login page
							// alert('register page');
							chrome.tabs.update(tabId, {url: "http://delicious.com/login"});
							// we edit the layout of the login page a bit in style.css
						}
					} else {
						// Double check that it's actually our popup, if not, exit
						// What I'm founding now, is that windows CAN and DO share the same tab.id
						// 
						if(data.startsWith(tldURL)) {
							chrome.tabs.remove(tabId);
						} else {
							// We're here by mistake
							// alert('Whoops, don\'t close ME!');
						}
					}
				}
			
			
			});
		});	
	
	}
	
});

chrome.extension.onRequest.addListener(
	function(message, sender, sendResponse) {
		console.log('I heard something');
		if (message.action && sender.tab) {
			switch (message.action) {
				case 'getFromLocalStorage':
					console.log(message.variableName + ': ' + localStorage [message.variableName]);
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
	// this listener is activate be it from shortcut or be it from popup
	var callback = selection_callbacks.shift();
	callback(request);
});

// Respond to messages passed from addDelicous.js content script
chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
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
		w = c.width || 550,
		h = c.height || 550,
		deliciousUrl = c.deliciousUrl || "http://delicious.com/save?url=",
		fullUrl;

	fullUrl = deliciousUrl + encodeURIComponent(url) + '&title=' + encodeURIComponent(title) + '&note=' + encodeURIComponent(notes);
	console.log('addDelicious has run');
	// Chrome's API for creating windows (rather than simple window.open)
	chrome.windows.create({
		url: fullUrl,
		width: w,
		height: h,
		type: 'popup'
		}, function() {
			chrome.windows.getCurrent(function(window) {
				chrome.tabs.getSelected(window.id,
				function (response){
					ourWindow = response.id
					// alert('Our window has a tab id of: ' + ourWindow);
				});
			});				
	});
	
};
