$(function () {
	var $slide = $("#slide");
	$(window).scroll(function () {//页面滚动.让slide 居中
		if ($(this).scrollTop() > $('.navbar').height() + $('.centre').outerHeight()) {
			$slide.css({ 'position': 'fixed', "top":"20px" });
		} else {
			$slide.css({ "position": "static", "top": $('.navbar').height() + $('.centre').outerHeight() + 20 + "px" });
		}
	})
	var $control = $("#slide .control"),
		height = $control.height(),
		$nav = $(".nav"),
		length = $nav.length,
		index = 0,
		$blue = $("#slide .blue"),
		mark = true;
	// slide的点击跳转.
	$control.click(function () {
		mark = !mark;
		var This = this;
		index = $(this).index();
		// 替换样式.
		$(this).addClass("active").siblings().removeClass("active");
		// 跳转.
		$("body,html").stop().animate({//会执行两次
			"scrollTop": $nav.eq(index).offset().top + "px"
		}, 300);
		// 小块跟随.
		$blue.show().stop().animate({
			top: height * index + "px"
		}, 300, function () {
			$(this).hide();
			// 跳转结束让开关开启
			mark = !mark;
		});
	});
	// 页面滚动,让slide跟随.
	$(window).scroll(function () {
		// 点击跳转时不用检测.
		if (mark) {
			for (var i = 0; i < length; i++) { //检测滚轮高度
				if ($nav.eq(i).offset().top > $(this).scrollTop()) { // 让上一个control 显示.
					index = i - 1;
					if (index < 0) { //i=0时.  不显示.
						index = 0;
						$control.removeClass("active");
					} else { //当i>=1时. 才开始显示.
						$control.eq(index).addClass("active").siblings().removeClass("active");
						// $blue 同步.
						$blue.css("top", height * index + "px");
					}
					break;//检测到一个就退出.
				}
			}
			// 最后一个.
			if ($nav.last().offset().top < $(this).scrollTop()){
				$control.last().addClass("active").siblings().removeClass("active");
				// $blue 同步.
				$blue.css("top", (length - 1) * index + "px");
			}
		}
	})
});
