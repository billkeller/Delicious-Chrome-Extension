
(function() {
	
	console.log('loaded addDelicious');
	
	// Listen for keyboard shortcut
	var bookmarkKeyCode = 'D'.charCodeAt(0);
	window.addEventListener(
		'keydown', 
		function(e) {
			if (e.which == bookmarkKeyCode && e.altKey) {
				console.log('pressed ^d');
				addDeliciousFromContentScript();
			}
		},
		false
	);
	
	// Trigger delicious window from popup.html
	// Note: currently no way to retrieve selected text
	// addDeliciousFromPopup is now set directly in popup.html
	/*
	addDeliciousFromPopup = function(text) {
		chrome.tabs.getSelected(null, function(tab) {
			chrome.extension.sendRequest({
				type: 'addDelicious',
				url: tab.url,
				title: tab.title,
				notes: text
			});
		});
	};
	*/

	// Send request to background page (content script not permitted to create new windows)
	addDeliciousFromContentScript = function() {
		var url = document.location.toString(),
			title = document.title,
			notes = '',
			notesMaxLength = 1000;
		
		if (window && window.getSelection) {
			notes = window.getSelection().toString();
		} else if (document && document.getSelection) {
			notes = document.getSelection().toString();
		}
		
		if (notes && notes.length > notesMaxLength) {
			notes = notes.substring(0, notesMaxLength - 1);
		}
		
		chrome.extension.sendRequest({
			type: 'addDelicious',
			url: url,
			title: title,
			notes: notes
		});
	};
})();
