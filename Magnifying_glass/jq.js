$(function() {
	$('.show').on("click", "span img:not(.f_img)", function() {
		var imgs = $(this).attr('src');
		$('.small_box img').attr("src", imgs);
		$('.big_box img').attr("src", imgs);
		$('.show_box').css({
			"left": "0px",
			"top": "0px"
		});
	});

	$('.f_img').click(function() {
		var jie = $('<span><img src=""/></span>');
		$('.show span').eq(-2).after(jie);
		$('.show span').eq(-2).css("display","none");
	});

	$(".file").change(function(e) {
		//得到事件的目标节点，既input元素
		var imgBox = e.target;
		getImg(imgBox);
		$(".file").change = null;
		$('.show span').eq(-2).css("display","inline-block");
	});

	function getImg(tag) {
		//第一张input选择的图片的一些参数
		var file = tag.files[0];
		var reader = new FileReader();
		//将文件以Data URL形式读入页面
		reader.readAsDataURL(file);
		reader.onload = function() {
			//result结果为 DataURL
			var imgSrc = this.result;
			//将图片显示出来
			// console.log(imgSrc);
			$('.show span img').eq(-2).attr("src", imgSrc);
		}
	}

	$('.show_box').on("mouseover", function() {
		$('.big_box').show();
	});
	$('.show_box').on("mouseout", function() {
		$('.big_box').hide();
	});
	$('.small_box').on("mousemove", function(e) {
		//e.pagex左边页面到鼠标的距离
		//$('.small_box').offset().left相对于文档的偏移
		//$('.small_box').width()盒子的宽度
		//鼠标到左边的距离-盒子向右边偏移的值10-阴影盒子25
		var lt = e.pageX - $('.small_box').offset().left - ($('.show_box').width() / 2);
		var tp = e.pageY - $('.small_box').offset().top - ($('.show_box').width() / 2);
		// console.log(e.pageX)
		// console.log(lt)
		if (lt < 0) {
			lt = 0;
		}
		if (lt > $(this).width() - $('.show_box').width()) {
			lt = $(this).width() - $('.show_box').width()
		}

		if (tp < 0) {
			tp = 0;
		}
		if (tp > $(this).height() - $('.show_box').height()) {
			tp = $(this).height() - $('.show_box').height()
		}

		$('.show_box').css({
			"left": lt,
			"top": tp
		});
		//180-50
		var px = lt / ($('.small_box').width() - $('.show_box').width());
		var py = tp / ($('.small_box').height() - $('.show_box').height());
		// console.log(px);
		$('.big_box img').css({
			"left": -px * ($('.big_box img').width() - $('.big_box').width()),
			"top": -py * ($('.big_box img').height() - $('.big_box').height())
		});
	});
});
