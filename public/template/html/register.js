require(["../../scripts/config.js"], function() {
	require(["jquery","cookie","validate","validatezh"], function($,cookie,validate,_) {
		$(function() {
			//写代码
			$("form").validate();
			$(".close").click(function(){
				$("#form1").hide()
			})
			$(".eye1").click(function(){
				if($("#pass").attr("type")=="password"){
					$("#pass").prop("type","text")					
				}else{
					$("#pass").prop("type","password")
				}
			})
			$(".eye2").click(function(){
				if($("#pass2").attr("type")=="password"){
					$("#pass2").prop("type","text")					
				}else{
					$("#pass2").prop("type","password")
				}
			})
			$("input#btn").click(function(){
				var user=$("#user").val()
				var pass=$("#pass").val()
				if(user.length!=0 && pass.length!=0){
					userinfo=JSON.parse($.cookie("userinfo")) || [];
					if(userinfo.length<1){
						userinfo.push({
							username:user,
							psd:pass
						})	
					}else{
						var onoff=true
						$.each(userinfo, function(index,value) {
							if(value.username==user){
								alert("用户名已存在！")
								onoff=false;
							}
						});
						if(onoff){
							userinfo.push({
								username:user,
								psd:pass
							})
						}
					}
					$.cookie("userinfo",JSON.stringify(userinfo),{expires:7})
					alert("注册成功")
					console.log(JSON.parse($.cookie("userinfo")))
				}else{
					alert("请输入信息！")
				}
				location.href="../html/login.html"
			})
			$(".ln").click(function(){
				location.href ="../html/index.html";
			})
			
		})
	})
})	