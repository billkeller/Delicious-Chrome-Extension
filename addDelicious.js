
(function() {
	
	// Listen for keyboard shortcut
	var bookmarkKeyCode = 'D'.charCodeAt(0);
	window.addEventListener(
		'keydown', 
		function(e) {
			if (e.which == bookmarkKeyCode && e.ctrlKey) {
				triggerAddDelicious();
			}
		},
		false
	);

	// Send request to background page (content script not permitted to create new windows)
	triggerAddDelicious = function() {
		var url = document.location.toString(),
			title = document.title;
		
		if (!/^chrome/.test(url)) {
			// URL seems good; use it
			chrome.extension.sendRequest({
				url: url,
				title: title
			});
		} else {
			// Called from popup.html; need to get current tab
			chrome.tabs.getSelected(null, function(tab) {
				chrome.extension.sendRequest({
					url: tab.url,
					title: tab.title
				});
			});
		}
	};
})();
