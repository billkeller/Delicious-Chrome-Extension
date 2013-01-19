$(document).ready(function() {
	$(window).load(function(){
		if(localStorage.getItem("bookmarkKeyChar")) {
			var bookmarkKeyChar_stored = localStorage.getItem("bookmarkKeyChar"),
				bookmarkSpecialKey_stored = localStorage.getItem("bookmarkSpecialKey");
			$('#bookmarkKeyChar').val(bookmarkKeyChar_stored);
			if (bookmarkSpecialKey_stored === null) {
				// Default to alt
				$('#bookmarkSpecialKey').val('alt');
			} else {
				$('#bookmarkSpecialKey').val(bookmarkSpecialKey_stored);
			}
		} else {
			$('#bookmarkKeyChar').val('D');
			$('#bookmarkSpecialKey').val('alt');
		}
	});
	$('#save_options').submit(function(){
		var bookmarkKeyChar = $('#bookmarkKeyChar').val(),
			bookmarkSpecialKey = $('#bookmarkSpecialKey').val();

		localStorage.setItem("bookmarkKeyChar", bookmarkKeyChar);
		localStorage.setItem("bookmarkSpecialKey", bookmarkSpecialKey);

		if(!localStorage.getItem("bookmarkKeyChar")) {
			$('.message').html('<p class=\"fail\">Please enter a Keyboard shortcut</p>');
		} else {
			$('.message').html('<p class=\"success\">Keyboard shortcut now set to <strong>' + localStorage.getItem("bookmarkSpecialKey") + ' ' + localStorage.getItem('bookmarkKeyChar') + '</strong><br /><small>Open tabs require a refresh</small>');
		}

		return false;
	});
	$('#bookmarkKeyChar').keyup(function() {
		var len = $(this).val().length;
		if (len > 1) {
			$(this).val($(this).val().substr(len - 1, 1));
		}
		$(this).val($(this).val().toUpperCase());
	});
});