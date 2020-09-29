$(function() {
	var $bli = $('.banner>.img>li');
	var $l = $bli.length;
	var i = 1;
	var timer = null;

	//1.轮播效果
	function carousel(value) {
		i = i % $l;
		$bli.eq(i).fadeIn(1000).siblings().fadeOut(1000);
		if (value == 1) i++;
		else if (value == 0) i--;
		$('.tab li').eq(i - 1).addClass('active').siblings().removeClass('active');
	}

	timer = setInterval(function() {
		carousel(1);
	}, 2000);
	// 2.鼠标移入停，移出动,向前向后按钮出现
	$('.banner').mouseenter(function() {
		clearInterval(timer);
		$('.btn').show(500);
	}).mouseleave(function() {
		timer = setInterval(function() {
			carousel(1);
		}, 2000);
		$('.btn').hide(500);
	});
	//3.向前向后按钮单击事件
	$('.btn .prev').click(function() {
		carousel(0);
	});
	$('.btn .next').click(function() {
		carousel(1);
	});
	//4.提示点的变化
	$('.tab li').click(function() {
		$(this).addClass('active').siblings().removeClass('active');
		var j = $(this).index()
		$bli.eq(j).stop().fadeIn(100).siblings().fadeOut(100);
	});


	//滚轮事件top
	$('.a_top').hide();
	$(window).scroll(function() {
		var wintop = $(window).scrollTop(); //获取滚轮高度
		var ht = $(window).height(); //获取页面高度

		if (ht > wintop) {
			$('.a_top').hide();

		} else {
			$('.a_top').show();
		}
	});
	
	$('.show').mouseover(function(){
		$('.nav-1-lis-items').show();
	}).mouseout(function(){
		$('.nav-1-lis-items').hide();
	})

});
