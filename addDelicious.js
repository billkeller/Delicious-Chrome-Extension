
(function() {
	
	// Listen for keyboard shortcut
	var bookmarkKeyCode = 'D'.charCodeAt(0);
	window.addEventListener(
		'keydown', 
		function(e) {
			if (e.which == bookmarkKeyCode && e.ctrlKey) {
				addDeliciousFromContentScript();
			}
		},
		false
	);
	
	// Trigger delicious window from popup.html
	// Note: currently no way to retrieve selected text
	addDeliciousFromPopup = function() {
		chrome.tabs.getSelected(null, function(tab) {
			chrome.extension.sendRequest({
				type: 'addDelicious',
				url: tab.url,
				title: tab.title,
				notes: ''
			});
		});
	};

	// Send request to background page (content script not permitted to create new windows)
	addDeliciousFromContentScript = function() {
		var url = document.location.toString(),
			title = document.title,
			notes = '';
		
		if (window && window.getSelection) {
			notes = window.getSelection().toString();
		} else if (document && document.getSelection) {
			notes = document.getSelection().toString();
		}
		
		chrome.extension.sendRequest({
			type: 'addDelicious',
			url: url,
			title: title,
			notes: notes
		});
	};
})();
