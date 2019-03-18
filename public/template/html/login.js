require(["../../scripts/config.js"], function() {
	require(["jquery","cookie","validate","validatezh"], function($,cookie,validate,_) {
		$(function() {
			//写代码
//			$("form").validate();
			$(".close").click(function(){
				$("#form2").hide()
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
			$("input#btn2").click(function(){
//				console.log("1")
				var user2=$("#user2").val()
				var pass3=$("#pass3").val()
				if(user2.length!=0 && pass3.length!=0){
					var login=JSON.parse($.cookie("userinfo"))
					var onoff=true;
					$.each(login, function(index,value){
						if(user2==value.username && pass3==value.psd){
							alert("登陆成功")
							location.href ="../html/index.html";
							onoff=false;
						}
					});
					if(onoff){
						alert("账户或密码错误，请重新输入")
						location.href ="../html/login.html";
					}
				}
			})
			$(".ln").click(function(){
				location.href ="../html/index.html";
			})
			
			$(".eye1").click(function(){
				if($("#pass3").attr("type")=="password"){
					$("#pass3").prop("type","text")					
				}else{
					$("#pass3").prop("type","password")
				}
			})
			
		})
	})
})	