<?php
	$name=$_GET['n_ame'];
	
	$naemArr=array("aaa","bbb","ccc","bbb");
	
	if(in_array($name,$naemArr)){
		echo "该账号已被注册，不可以注册";
	}else{
		echo "恭喜该账号可以注册";
	}
?>