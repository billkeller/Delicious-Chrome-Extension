(function() {
	var localSettings = {
		bookmarkKeyChar: 'D'
	};

	function getVariableFromLocalStorage(variableName,defaultValue) {
		localSettings[variableName] = defaultValue;
		var onResponse = function (response) {
			 if (response != null) {
				localSettings[variableName] = response;
				console.log('localSettings.' + variableName + ' is set to: ' + response);
			 } else {
				console.log('localSettings.' + variableName + ' not found in localStorage!  ' + response);
			}
		}
		chrome.extension.sendRequest({'action': 'getFromLocalStorage', 'variableName': variableName}, onResponse)
	};

	getVariableFromLocalStorage('bookmarkKeyChar', localSettings.bookmarkKeyChar);

	// Listen for key press
	window.addEventListener(
		'keydown',
		function(e) {
			if (e.which == localSettings.bookmarkKeyChar.charCodeAt(0) && e.altKey) {
				console.log('pressed ^d (or whatever key)');
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
