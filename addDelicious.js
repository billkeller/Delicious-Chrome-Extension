
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
		chrome.extension.sendRequest({
			url: document.location.toString(),
			title: document.title
		});
	};
})();
