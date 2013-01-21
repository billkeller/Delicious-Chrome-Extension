var localSettings = {
	bookmarkKeyChar: 'D',
	bookmarkSpecialKey: 'alt'
};

function getVariableFromLocalStorage(variableName,defaultValue) {
	localSettings[variableName] = defaultValue;
	var onResponse = function (response) {
		 if (response !== null) {
			localSettings[variableName] = response;
			// console.log('localSettings.' + variableName + ' is set to: ' + response);
		 } else {
			// console.log('localSettings.' + variableName + ' not found in localStorage!  ' + response);
		}
	}
	chrome.extension.sendRequest({'action': 'getFromLocalStorage', 'variableName': variableName}, onResponse)
};

getVariableFromLocalStorage('bookmarkKeyChar', localSettings.bookmarkKeyChar);
getVariableFromLocalStorage('bookmarkSpecialKey', localSettings.bookmarkSpecialKey);

// Listen for key press
window.addEventListener(
	'keydown',
	function(e) {
		if ((e.which == localSettings.bookmarkKeyChar.charCodeAt(0))
				&& (
					(localSettings.bookmarkSpecialKey == 'alt' && e.altKey)
					|| (localSettings.bookmarkSpecialKey == 'ctrl' && e.ctrlKey)
					|| (localSettings.bookmarkSpecialKey == 'meta' && e.metaKey)
				)) {
			// console.log('pressed '+ localSettings.bookmarkSpecialKey + ' ' + localSettings.bookmarkKeyChar);
			// prevent the default, doesn't seem to overwrite the windows (Meta) key
			e.preventDefault();
			addDeliciousFromContentScript();

		    /*
		    Optionally, we COULD run the bookmarklet itself, but only when initiated via keyboard shortcut
		    function f(i) {
		        if (i.origin !== e + "" + n && i.origin !== t + "" + n) {
		            return
		        }
		        if (i.data === "destroy_bookmarklet") {
		            var s = document.getElementById(r);
		            if (s) {
		                document.body.removeChild(s);
		                s = null
		            }
		        }
		    }
		    var e = "http://",
		        t = "https://",
		        n = "delicious.com",
		        r = "DELI_bookmarklet_iframe",
		        i = document.getElementById(r);
		    if (i) {
		        return
		    }
		    var s = e + "" + n + "/save?",
		        o = document.createElement("iframe");
		    o.id = r;
		    o.src = s + "url=" + encodeURIComponent(window.location.href) + "&title=" + encodeURIComponent(document.title) + "&note=" + encodeURIComponent("" + (window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : document.selection.createRange().text)) + "&v=1.1";
		    o.style.position = "fixed";
		    o.style.top = "0";
		    o.style.left = "0";
		    o.style.height = "100%";
		    o.style.width = "100%";
		    o.style.zIndex = "9999999";
		    o.style.border = "none";
		    o.style.visibility = "hidden";
		    o.onload = function () {
		        this.style.visibility = "visible"
		    };
		    document.body.appendChild(o);
		    var u = window.addEventListener ? "addEventListener" : "attachEvent";
		    var a = u == "attachEvent" ? "onmessage" : "message";
		    window[u](a, f, false)
			*/

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