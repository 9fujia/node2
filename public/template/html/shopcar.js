require(["../scripts/config.js"], function() {
	require(["jquery", "swiper", "cookie"], function($, Swiper, cookie) {
		$(function() {
			//写代码
			$("#nav .nav-l").find("li").hover(
				function() {
					//鼠标进入改变li背景色
					$(this).find("a").attr("class", "active");
					$(this).siblings().find("a").removeAttr("class");
					//改变li小图标
					$(this).find("span").attr("class", "active")
					$(this).siblings().find("span").attr("class", "xj");
					//显示当前商品列表
					$(this).find(".nav-contentbox").addClass("active")
					$(this).siblings().find(".nav-contentbox").removeClass("active")
				},
				function() {
					//鼠标移出还原nav
					$(this).find("a").removeAttr("class", "active");
					$(this).find("span").attr("class", "xj")
					//					
					//隐藏当前商品列表
					$(this).find(".nav-contentbox").removeClass("active")
				})
			$(".all").click(function() {
				$(this).toggleClass("active")
				$(".only").toggleClass("active")
			})
			$(".logo").click(function() {
				location.href = "../html/index.html";
			})
			//读取cookie
			var shoppingCart = JSON.parse($.cookie("shoppingCart")) //是一个json对象
			var zj=0
//			console.log(shoppingCart)
			//从商品详情页拿cookie 渲染数据
			$.ajax({
				url: "http://47.102.141.79/api/product?pageNumber=50",
				success: function(data) {
					
					//	遍历cookie中数据和接口数据
					var str1 = ""
						$.each(shoppingCart, function(key, item) {
							console.log(item)
							//判断优惠金额，接口数据里存在原价格为0，所以需要判断优惠金额不能出现负数
						$.each(data.data, function(index, value) {
							let old = parseInt(value.sale)
							let now = parseInt(value.price)
							
						
							
							if((old - now) < 0) {
								var discounts = old;
							} else {
								var discounts = old - now;
								
							}
							
							//cookie数据id如果和接口数据id一致,渲染页面
							if(item.id == value.id) {
								//设置总价zj
								zj+=value.discount_price * item.num
										str1 += `<ul class="goods" index="${item.id}"><li style="width: 46px;height: 120px;">
									<span class="only"></span>
								</li>
								<li style="width: 76px;">
									<img class="goods-img" src="${value.img}"/>
								</li>
								<li style="width: 254px;">
									<span class="goods-title">${value.title}</span>
								</li>
								<li>
									<span class="goods-size">尺码:${item.size}</span>
								</li>
								<li>
									<p class="old-price">¥${value.sale}</p>
									<p class="now-price">${value.price}</p>
								</li>
								<li>
									<div class="num">
										<input class="minus" type="button" id="" value="-">
										<input class="many" type="text" id="" value="${item.num}">
										<input class="add" type="button" id="" value="+">
									</div>
								</li>
								<li>
									<span class="discounts">¥${discounts*item.num}</span>
								</li>
								<li>
									<span class="xiaoji">¥${(value.price * item.num).toFixed(2)}</span>
								</li>
								<li style="width: 60px;">
									<span class="delete">删除</span>
								</li>
							</ul>`
								$("#goods-cart").html(str1)
								
							}
						})
					})
						
						$(".totalSum").html(zj)
						
				}
			})
			//设置input+
			$("#goods-cart").on("click",".add",function(e){
				
				let many=parseInt($(this).siblings(".many").attr("value"))
				let dj=$(this).parent().parent().siblings().children(".now-price").html()
				let oldprice=$(this).parent().parent().siblings().children(".old-price").html()
					oldprice=+oldprice.match(/\d+/g).join(".")
				let nowprice=$(this).parent().parent().siblings().children(".now-price").html()
					nowprice=+nowprice.match(/\d+/g).join(".")
				let discounts=parseFloat((oldprice -nowprice)*many+(oldprice -nowprice)).toFixed(2)
				zj+=parseInt(dj)
					$(".totalSum").html(zj)
				//正则表达式求dj数值,数组转字符
				dj=+dj.match(/\d+/g).join(".")
				var xj=parseFloat(dj*many+dj).toFixed(2)
				
					//改变many的值
					$(this).siblings(".many").attr("value",many+1)
					$(this).parent().parent().siblings().children(".xiaoji").html("¥"+xj)
					//设置优惠金额
					$(this).parent().parent().siblings().children(".discounts").html("¥"+discounts)
			})
			//设置input-
			$("#goods-cart").on("click",".minus",function(e){
				let many=parseInt($(this).siblings(".many").attr("value"))
				let oldprice=$(this).parent().parent().siblings().children(".old-price").html()
					oldprice=+oldprice.match(/\d+/g).join(".")
				let nowprice=$(this).parent().parent().siblings().children(".now-price").html()
					nowprice=+nowprice.match(/\d+/g).join(".")
				let dj=$(this).parent().parent().siblings().children(".now-price").html()
				 	dj=+dj.match(/\d+/g).join(".")
				let xj=parseFloat(dj*many-dj).toFixed(2)
				if(many<2){
					$(this).siblings(".many").attr("value",1)
				}else{
					$(this).siblings(".many").attr("value",many-1)
					$(this).parent().parent().siblings().children(".xiaoji").html("¥"+xj)
				}
				let discounts=parseFloat((oldprice -nowprice)*many-(oldprice -nowprice)).toFixed(2)
				//设置优惠金额
				$(this).parent().parent().siblings().children(".discounts").html("¥"+discounts)
				zj-=parseInt(dj).toFixed(2)
				console.log(zj)
					$(".totalSum").html(zj)
			})
			//手动输入many改变数量
			$("#goods-cart").on("blur",".many",function(){
				var many=parseInt($(this).val())
				var dj=$(this).parent().parent().siblings().children(".now-price").html()
				var dj=+dj.match(/\d+/g).join(".")
				var xj=parseFloat(dj*many).toFixed(2)
				$(this).parent().parent().siblings().children(".xiaoji").html("¥"+xj)
			})
			//点击 +-改变数量，修改cookie里的num
			$("#goods-cart").on("click",".minus,.add",function(){
				var many=$(this).siblings(".many").attr("value")
				console.log(many)
				shoppingCart=JSON.parse($.cookie("shoppingCart"))
//				console.log(shoppingCart)
				$.each(shoppingCart, function(index,value) {
					value.num=many;
				});
				//重新设置cookie
				$.cookie("shoppingCart",JSON.stringify(shoppingCart),{expires:7})
			})
//			点击many失去焦点
			$("#goods-cart").on("blur",".many",function(){
				var many=parseInt($(this).val())
				console.log(many)
				shoppingCart=JSON.parse($.cookie("shoppingCart"))
				console.log(shoppingCart)
				$.each(shoppingCart, function(index,value) {
					value.num=many;
				});
//				重新设置cookie
				$.cookie("shoppingCart",JSON.stringify(shoppingCart),{expires:7})
			})
			//优惠总金额
			
		//删除购物车商品
			//读cookie
			$("#goods-cart").on("click",".delete",function(){
				//删除页面结构
				$(this).parent().parent().remove()
				//删除cookie
				var id=$(this).parent().parent().attr("index")
				for(var i=0;i<shoppingCart.length;i++){
					if(shoppingCart[i].id==id){
						shoppingCart.splice(i,1);
						break
					}
				}
				$.cookie("shoppingCart",JSON.stringify(shoppingCart),{expires:7})
			})
			$(".ln").click(function(){
				location.href="../html/index.html";
			})
			
			//试试计算总金额
			
		})
	})
})