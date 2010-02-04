(function() {
	function getVariableFromLocalStorage(variableName,defaultValue) {
		this[variableName] = defaultValue;
		var onResponse = function (response) {
			 if (response != null) {
				this[variableName] = response;
				console.log(variableName + ' is set to: ' + response);
			 } else {
				console.log(variableName + ' not found in localStorage!  ' + response);
		 }
		}
		chrome.extension.sendRequest({'action': 'getFromLocalStorage', 'variableName': variableName}, onResponse)
	};

	// Listen for key press
	window.addEventListener(
		'keydown',
		function(e) {
			// bookmarkKeyCode is always returning "undefined" not sure how to grab it from getVariableFromLocalStorage function
			var bookmarkKeyCode = getVariableFromLocalStorage('bookmarkKeyCode','D');
			console.log(bookmarkKeyCode);
			if (e.which == bookmarkKeyCode && e.altKey) {
				console.log('pressed ^d');
				addDeliciousFromContentScript();
			}
		},
		false
	);

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
