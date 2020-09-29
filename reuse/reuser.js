$(function(){
	$('#header').load("top.html");
	$('#footer').load("footer.html",function(){
		if($(window).height()>$('html').height()){
			$('footer').css({
				"position":"fixed",
				"bottom": "0",
				"left": "0"
			});
		}
	});
});

