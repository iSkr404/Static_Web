<?php 
	
	// 休息一会
	sleep(1);

	// 获取 用户发送的 消息  (可选)
	// 后端 对于 用户发过来的 时候 是否 使用 (可选)
	
	// 根据 发送 过来的 消息 返回 不同的内容
	$messageList =array(
		'我们有新款的小米10哦',
		'有需要什么服务吗',
		'应有尽有，尽你挑选',
		'你真可爱',
		'快来下单吧主人',
		'你太有意思了，记得下单我们的产品哦',
		'么么哒:}' 
	 );

	// 从 数组中 每次 随机 取出
	// array_rand 返回的 是一个 随机的 下标
	$randomKey = array_rand($messageList,1);

	// 使用 随机 下标 返回 随机的 值
	echo $messageList[$randomKey];


 ?>