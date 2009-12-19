var deliciousUrl = "http://delicious.com/save?v=5&amp;noui&amp;jump=close&amp;url=";
var url;
var title;

 function add_delicious() {
 	chrome.tabs.getSelected( null , function(tab) {
 		url = (tab.url);
 		title = (tab.title);
 		window.open(deliciousUrl + encodeURIComponent(url) + '&title=' + encodeURIComponent(title) +' ','deliciousuiv5','location=yes,links=no,scrollbars=no,toolbar=no,width=550,height=550');
 	});
 }

//sample popup URL from Delicious: 
//javascript:(function(){f='http://delicious.com/save?url='+encodeURIComponent(window.location.href)+'&title='+encodeURIComponent(document.title)+'&v=5&';a=function(){if(!window.open(f+'noui=1&jump=doclose','deliciousuiv5','location=yes,links=no,scrollbars=no,toolbar=no,width=550,height=550'))location.href=f+'jump=yes'};if(/Firefox/.test(navigator.userAgent)){setTimeout(a,0)}else{a()}})()