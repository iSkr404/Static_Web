$(function() {
	$('#search_but').button({
		icons: {
			primary: 'ui-icon-search'
		},
		label: "搜索"
	});
	/* but按钮设置插件样式 */
	$('#reg').buttonset();
	/* 提示工具 */
	$('#reg input[title]').tooltip({
		position: {
			my: "left centen",
			at: "right+5 centen"
		},
		show: false,
		hide: false
	});
	if ($.cookie('user')) {
		$('#member,#logout').show();
		$('#reg_z,#login_l').hide();
		$('#member').html($.cookie('user'));
	} else {
		$('#member,#logout').hide();
		$('#reg_z,#login_l').show();
	}
	$.ajax({
		url: 'show_content.php',
		type: 'POST',
		success: function(response, status, xhr) {
			var html = ' ';
			var json = jQuery.parseJSON(response);
			var arr = [];
			var summary = [];
			$.each(json, function(index, value) {
				html += '<h3>' + value.title + '</h3><h4>' + value.user + ' 发表于 ' + value.date + '</h4><div class="editor">' +
					value.content + '</div><div class="bottom"><span class="comment" data-id="' + value.id + '">' + value.count +
					'条评论</span> <span class="up">收起</span></div><hr noshade="noshade" size="1" /><div class="comment_list"></div>';
			});
			$('.content').append(html);
	
			$.each($('.editor'), function(index, value) {
				arr[index] = $(value).html();
				summary[index] = arr[index].substr(0, 200);
	
				if (summary[index].substring(199, 200) == '<') {
					summary[index] = replacePos(summary[index], 200, '');
				}
				if (summary[index].substring(198, 200) == '</') {
					summary[index] = replacePos(summary[index], 200, '');
					summary[index] = replacePos(summary[index], 199, '');
				}
	
				if (arr[index].length > 200) {
					summary[index] += '...<span class="down">显示全部</span>';
					$(value).html(summary[index]);
				}
				$('.bottom .up').hide();
			});
	
			$.each($('.editor'), function(index, value) {
				$(this).on('click', '.down', function() {
					$('.editor').eq(index).html(arr[index]);
					$(this).hide();
					$('.bottom .up').eq(index).show();
				});
			});
	
			$.each($('.bottom'), function(index, value) {
				$(this).on('click', '.up', function() {
					$('.editor').eq(index).html(summary[index]);
					$(this).hide();
					$('.editor .down').eq(index).show();
				});
			});
			$.each($('.bottom'), function(index, value) {
				$(this).on('click', '.comment', function() {
					var coment_this=this;
					if ($.cookie('user')) {
						if (!$('.comment_list').eq(index).has('form').length)
								$.ajax({
									url:'show_comment.php',
									type:'POST',
									data:{
										titleid:$(coment_this).attr('data-id'),
									},
									beforeSend:function(jqXHR,settings){
										$('.comment_list').eq(index).append('<dl class="comment_load"><dd>正在加载评论</dd><dl>');
									},
									success:function(response,status){
										$('.comment_list').eq(index).find('.comment_load').hide();
										var json_comment = jQuery.parseJSON(response);
										var count=0;
										$.each(json_comment, function(index_c, value) {
											count=value.count;
											$('.comment_list').eq(index).append('<dl class="comment_content"><dt>'+value.user+'</dt><dd class="">'+value.comment+'</dd><dd class="date">'+value.date+'</dd>')
											});
											// 加载更多
										$('.comment_list').eq(index).append('<dl><dd><span class="load_more">加载更多评论</span></dd></dl>');
										var page=2;
										if(page>count){
											$('.comment_list').eq(index).find('.load_more').off('click');
											$('.comment_list').eq(index).find('.load_more').hide();
										}
										
										$('.comment_list').eq(index).find('.load_more').button().on('click',function(){
											$('.comment_list').eq(index).find('.load_more').button('disable');
											$.ajax({
												url:'show_comment.php',
												type:'POST',
												data:{
													titleid:$(coment_this).attr('data-id'),
													page : page,
												},
												beforeSend:function(jqXHR,settings){
													$('.comment_list').eq(index).find('.load_more').html('<img src="img/more_load.gif"/>')
												},
												success:function(response,status){
													var json_comment_more = jQuery.parseJSON(response);
													$.each(json_comment_more, function(index_3, value) {
														$('.comment_list').eq(index).find('.comment_content').last().after('<dl class="comment_content"><dt>'+value.user+'</dt><dd class="">'+value.comment+'</dd><dd class="date">'+value.date+'</dd>');
														});
														$('.comment_list').eq(index).find('.load_more').button('enable');
														$('.comment_list').eq(index).find('.load_more').html("加载更多评论");
														page++;
														if(page>count){
															$('.comment_list').eq(index).find('.load_more').off('click');
															$('.comment_list').eq(index).find('.load_more').hide();
														}
												}
											});
										});
										$('.comment_list').eq(index).append(
											'<form><dl class="comment_add"><dt><textarea name="comment"></textarea></dt><dd><input type="hidden" name="titleid" value="' +
											$(coment_this).attr('data-id') + '" /><input type="hidden" name="user" value="' + $.cookie('user') +
											'" /><input type="button" value="发表" /></dd></dl></form>');
										/* 添加评论 */
										$('.comment_list').eq(index).find('input[type=button]').button().click(function() {
											var _this = this;
											$('.comment_list').eq(index).find('form').ajaxSubmit({
												url: 'add_comment.php',
												type: 'POST',
												beforeSubmit: function(formDate, jqFprm, options) {
													/* 显示数据交互框 */
													$('#loading').dialog("open");
													/* 提交完数据but不可用 */
													$(_this).button('disable');
												},
												success: function(responseText, statusText) {
													if (responseText) {
														$(_this).button('enable');
														$('#loading').css('background', 'url(img/success.gif) no-repeat 20px center').html("发布成功...");
														setTimeout(function() {
															var date = new Date();
															$('#loading').dialog('close');
															$('.comment_list').eq(index).prepend('<dl class="comment_content"><dt>' + $.cookie('user')+ '</dt><dd>' + $('.comment_list').eq(index).find('textarea').val() + '</dd><dd>' +date.getFullYear() + '-' + (date.getMonth()+ 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' +date.getMinutes() + ':' + date.getSeconds() + '</dd></dl>');															
															$('.comment_list').eq(index).find('form').resetForm();
															$('#loading').css('background', 'url(img/loading.gif) no-repeat 20px center').html(
																"数据交互中...");
														}, 1000);
													}
												},
											});
										});	
									},
								});
						if ($('.comment_list').eq(index).is(':hidden')) {
							$('.comment_list').eq(index).show();
	
						} else {
							$('.comment_list').eq(index).hide();
						}
						
					} else {
						$('#error').dialog('open');
						setTimeout(function() {
							$('#error').dialog('close');
							$('#login').dialog('open');
						}, 1000);
					}
				});
			});
		}
	});
	$('#logout').click(function() {
		$.removeCookie('user');
		window.location.href = '/web/';
	});
	$("#reg_z").click(function() {
		$("#reg").dialog("open");
	});
	$("#reg").dialog({
		autoOpen: false,
		modal: true,
		resizable: false,
		buttons: {
			"提交": function() {
				$(this).submit();
			},
			"取消": function() {
				$(this).dialog("close");
			}
		},
		width: 325,
		height: 340,
		show: "blind",
		hide: "blind",
		closeText: "关闭",
		/* 表单验证 */
	}).buttonset().validate({
		/* ajax表单验证 */
		submitHandler: function(form) {
			$(form).ajaxSubmit({
				url: 'add.php',
				type: 'POST',
				beforeSubmit: function(formDate, jqFprm, options) {
					/* 显示数据交互框 */
					$('#loading').dialog("open");
					/* 提交完数据but不可用 */
					$('#reg').dialog("widget").find('button').eq(1).button('disable');
				},
				success: function(responseText, statusText) {
					if (responseText) {
						$('#reg').dialog("widget").find('button').eq(1).button('enable');
						$('#loading').css('background', 'url(img/success.gif) no-repeat 20px center').html("数据新增成功...");
						/* cookie插件 */
						$.cookie('user', $('#user').val());
						setTimeout(function() {
							$('#loading').dialog('close');
							$('#reg').dialog('close');
							$('#reg').resetForm();
							$('#reg span.star').html('*').removeClass('succ');
							$('#loading').css('background', 'url(img/loading.gif) no-repeat 20px center').html("数据交互中...");
							$('#member,#logout').show();
							$('#reg_z,#login_l').hide();
							$('#member').html($.cookie('user'));
						}, 1000);
					}
				}
			});
		},
		showErrors: function(errorMap, errorList) {
			var errors = this.numberOfInvalids();
			if (errors > 0) {
				$('#reg').dialog('option', 'height', (20 * errors) + 340);
			} else {
				$('#reg').dialog('option', 'height', 340);
			}
			this.defaultShowErrors();
		},
		highlight: function(element, errorClass) {
			$(element).css('border', '1px solid #630');
			$(element).parent().find('span').html('*').removeClass('succ');
		},
		unhighlight: function(element, errorClass) {
			$(element).css('border', '1px solid #ccc');
			$(element).parent().find('span').html('&nbsp;').addClass('succ');
		},
		errorLabelContainer: 'ol.reg_error',
		wrapper: 'li',
		rules: {
			user: {
				required: true,
				minlength: 2,
				remote: {
					url: 'is_user.php',
					type: 'POST'
				}
			},
			pass: {
				required: true,
				minlength: 6,
			},
			email: {
				required: true,
				email: true,
			},
			bri: {
				date: true,
			}
		},
		messages: {
			user: {
				required: "账号不能为空！",
				minlength: jQuery.format("账号不能少于{0}位"),
				remote: "账号已注册"
			},
			pass: {
				required: "密码不能为空！",
				minlength: jQuery.format("密码不能少于{0}位"),
			},
			email: {
				required: "邮箱不能为空！",
				minlength: "请输入正确的邮箱！",
			},
			birthday: {
				date: true,
			}
		}
	});
	/* 自动完成提示 */
	$("#email").autocomplete({
		autoFocus: true,
		delay: 0,
		source: function(request, response) {
			var hosts = ["qq.com", "163.com", "263.com", "sina.com.cn", "gmail.com", "hotmail.com"],
				term = request.term, //获取用户输入的内容
				name = term, //邮箱的用户名
				host = '', //邮箱的域名
				ix = term.indexOf('@'), //@的位置
				result = []; //最终邮箱列表

			result.push(term);
			/* 当有@的时候，重新分配用户名域名 */
			if (ix > -1) {
				name = term.slice(0, ix); //用户名
				host = term.slice(ix + 1); //域名
			}

			if (name) {
				/* 如果用户已经输入@ 和后面的域名，那么久找到相关的域名提示，比如aa@1，就提示aa@qq.com
				如果用户还没输入@后面的那就要把所有的域名提示出来
				*/
				var findedhosts = (host ? $.grep(hosts, function(value, index) {
						return value.indexOf(host) > -1;
					}) : hosts),
					findResult = $.map(findedhosts, function(value, index) {
						return name + '@' + value;
					})
				result = result.concat(findResult);
			}
			response(result);
		}
	});
	/* 设置日历插件 */
	$("#birthday").datepicker({
		dateFormat: 'yy-mm-dd',
		dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
		monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
		monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
		weekHeader: "周",
		showWeek: true,
		showOtherMonths: true,
		changeMonth: true,
		changeYear: true,
		showOn: 'button',
		buttonImage: 'img/calendar.gif',
		buttonImageOnly: true,
		nextText: "下个月",
		prevText: "上个月",
		yearRange: "1950:2030",
		beforeShowDay: function(date) {
			if (date.getDate() == 4) {
				return [false, 'astop', '不能选择四号'];
			} else {
				return [true];
			}
		}
	});
	/* 登录 */
	$("#login_l").click(function() {
		$('#login').dialog("open");
	});
	$("#login").dialog({
		autoOpen: false,
		resizable: false,
		modal: true,
		buttons: {
			"登录": function() {
				$(this).submit();
			},
			"取消": function() {
				$(this).dialog("close");
			}
		},
		width: 325,
		height: 240,
		show: "blind",
		hide: "blind",
		closeText: "关闭"
		/* 表单验证 */
	}).validate({
		/* ajax表单验证 */
		submitHandler: function(form) {
			$(form).ajaxSubmit({
				url: 'login.php',
				type: 'POST',
				beforeSubmit: function(formDate, jqFprm, options) {
					/* 显示数据交互框 */
					$('#loading').dialog("open");
					/* 提交完数据but不可用 */
					$('#login').dialog("widget").find('button').eq(1).button('disable');
				},
				success: function(responseText, statusText) {
					if (responseText) {
						$('#login').dialog("widget").find('button').eq(1).button('enable');
						$('#loading').css('background', 'url(img/success.gif) no-repeat 20px center').html("登录成功...");
						/* cookie插件 */
						if ($('#exp').is(':checked')) {
							$.cookie('user', $('#login_user').val(), {
								expires: 7,
							})
						} else {
							$.cookie('user', $('#login_user').val());
						}
						setTimeout(function() {
							$('#loading').dialog('close');
							$('#login').dialog('close');
							$('#login').resetForm();
							$('#login span.star').html('*').removeClass('succ');
							$('#loading').css('background', 'url(img/loading.gif) no-repeat 20px center').html("数据交互中...");
							$('#member,#logout').show();
							$('#reg_z,#login_l').hide();
							$('#member').html($.cookie('user'));
						}, 1000);
					}
				},
			});
		},
		showErrors: function(errorMap, errorList) {
			var errors = this.numberOfInvalids();
			if (errors > 0) {
				$('#login').dialog('option', 'height', (20 * errors) + 240);
			} else {
				$('#login').dialog('option', 'height', 240);
			}
			this.defaultShowErrors();
		},
		highlight: function(element, errorClass) {
			$(element).css('border', '1px solid #630');
			$(element).parent().find('span').html('*').removeClass('succ');
		},
		unhighlight: function(element, errorClass) {
			$(element).css('border', '1px solid #ccc');
			$(element).parent().find('span').html('&nbsp;').addClass('succ');
		},
		errorLabelContainer: 'ol.login_error',
		wrapper: 'li',
		rules: {
			login_user: {
				required: true,
				minlength: 2,
			},
			login_pass: {
				required: true,
				minlength: 6,
				remote: {
					url: 'login.php',
					type: 'POST',
					data: {
						login_user: function() {
							return $('#login_user').val();
						}
					},
				},
			},
		},
		messages: {
			login_user: {
				required: "账号不能为空！",
				minlength: jQuery.format("账号不能少于{0}位"),
			},
			login_pass: {
				required: "密码不能为空！",
				minlength: jQuery.format("密码不能少于{0}位"),
				remote: "账户或密码不正确"
			},
		},
	});
	/* 选项卡插件使用 */
	$('#tabs').tabs({
		event: "mouseover",
		load: function(even, ui) {

		}
	});
	/* 折叠菜单 */
	$('#accordion').accordion();
	/* 提问编辑器插件*/
	$('#question_button').button({
		icons: {
			primary: 'ui-icon-lightbulb',
		}
	}).click(function() {
		if ($.cookie('user')) {
			$('#question').dialog('open');
		} else {
			$('#error').dialog('open');
			setTimeout(function() {
				$('#error').dialog('close');
				$('#login').dialog('open');
			}, 1000);
		}
	});
	$("#question").dialog({
		autoOpen: false,
		modal: true,
		resizable: false,
		width: 500,
		height: 370,
		buttons: {
			"发布": function() {
				$(this).ajaxSubmit({
					url: 'add_content.php',
					type: 'POST',
					data: {
						user: $.cookie('user'),
						content: $('.uEditorIframe').contents().find('#iframeBody').html(),
					},
					beforeSubmit: function(formDate, jqFprm, options) {
						/* 显示数据交互框 */
						$('#loading').dialog("open");
						/* 提交完数据but不可用 */
						$('#question').dialog("widget").find('button').eq(1).button('disable');
					},
					success: function(responseText, statusText) {
						if (responseText) {
							$('#question').dialog("widget").find('button').eq(1).button('enable');
							$('#loading').css('background', 'url(img/success.gif) no-repeat 20px center').html("发布成功...");
							$('.uEditorIframe').contents().find('#iframeBody').html("请输入问题描述？");
							setTimeout(function() {
								$('#loading').dialog('close');
								$('#question').dialog('close');
								$('#question').resetForm();
								$('#loading').css('background', 'url(img/loading.gif) no-repeat 20px center').html("数据交互中...");
							}, 1000);
						}
					},
				});
			},
			"取消": function() {
				$(this).dialog("close");
			}
		},
	});
	$('.uEditorCustom').uEditor();
	/* 登录在操作提示框 */
	$('#error').dialog({
		autoOpen: false,
		modal: true,
		closeOnEscape: false,
		resizable: false,
		draggable: false,
		width: 200,
		height: 50
	}).parent().find('.ui-widget-header').hide();
	/* 点击弹出提示对话框 */
	$('#loading').dialog({
		autoOpen: false,
		modal: true,
		closeOnEscape: false,
		resizable: false,
		draggable: false,
		width: 180,
		height: 50
	}).parent().find('.ui-widget-header').hide();

	function replacePos(strObj, pos, replaceText) {
		return strObj.substr(0, pos - 1) + replaceText + strObj.substring(pos, strObj.length);
	}
});
