require(["../scripts/config.js"], function() {
	require(["jquery", "swiper","cookie"], function($, Swiper,cookie) {
		$(function() {
			//写代码
			$(window).scroll(function() {
				var $t = $(this).scrollTop()
				if($t > 670) {
					$("#nav-left img").fadeIn(1000); //fadeIn 出现
				} else {
					$("#nav-left img").fadeOut(1000) //fadeOut 消失
				}
			})
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
			$("#zhugong .pt,.kj").find("img").click(
				function() {
					//让pt的第二张图片，如果是显示的，变成隐藏;隐藏的变为显示
					$("#zhugong .pt img:nth-child(2)").toggle()
					//让kj的第二张图片，如果是显示的，变成隐藏;隐藏的变为显示
					$("#zhugong .kj img:nth-child(2)").toggle()
					$("#zhugong .tab-p2").toggle()
					$("#zhugong .tab-p1").toggle()
				}
			)
			$("#product-bottom ul li").click(function() {
				$("#product-bottom ol li").eq($(this).index()).show().siblings().hide()
				$(this).find("p").addClass("active").parent().siblings().find("p").removeClass("active")
			})
			//读取cookie
			var goods=JSON.parse($.cookie("goods"))
			//渲染详情页
			$.ajax({
				url: "http://47.102.141.79/api/product?pageNumber=50",
				success: function(data) {
				
					console.log(data.data)
					//遍历数据(拿cookie数据和数据库中数据比较)
					var str1 = "";
					$.each(goods,function(key,item){
						console.log(item.id)
						$.each(data.data, function(index,value) {
							//cookie中id相同，渲染页面
							if(item.id==value.id){
							console.log(1)
								str1 = `<div class="smallImg" style="background-image:url(${value.img});">						
									<div class="smallCursor"></div>`
								$("#product .product-top .imgbox-t").append(str1)
								var str11=""
										str11=`<img src="${value.img}"/>
											<img src="${value.img}"/>
											<img src="${value.img}"/>
											<img src="${value.img}"/>
											<img src="${value.img}"/>`	
								$("#product .product-top .imgbox-b").append(str11)
								var bigCursor="";
									bigCursor=`<img class="bigImg" src="${value.img}"/>`
									$(".bigCursor").append(bigCursor)
								var str2 = ""
								str2 += `
									<p class="biaoti">${value.title}</p>
							
								<div class="guige-price">
									<p class="partNumber">
										<span class="t">商品编码：</span>
										<span class="v">${value.id}</span>
									</p>
									<p class="listPrice">
										<span class="t">吊牌价</span>
										<span class="oldmoney">${value.sale}</span>
									</p>
									<p class="offerPrice">
										<span class="t">销售价</span>
										<span class="v">${value.price}</span>
									</p>
									<p class="discount">
										<span class="t">折扣</span>
										<span class="v"> 56% (节省： ￥100.00 )</span>
									</p>
								</div>
								<p class="xzcolor">选择颜色:</p>
								
									<img class="xzimg active" src="${value.img}"/>
									<img class="xzimg" src="${value.img}"/>
									<img class="xzimg" src="${value.img}"/>
									<img class="xzimg" src="${value.img}"/>
									<img class="xzimg" src="${value.img}"/>
								
								<div class="size">
									<p class="xz">选择尺码</p>
									<p class="size-number">
										<input class="btn" type="button" name="" id="" value="39.5" />
										<input class="btn" type="button" name="" id="" value="40" />
										<input class="btn" type="button" name="" id="" value="40.5" />
										<input class="btn" type="button" name="" id="" value="41" />
										<input class="btn" type="button" name="" id="" value="41.5" />
										<input class="btn" type="button" name="" id="" value="42" />
										<input class="btn" type="button" name="" id="" value="42.5" />
										<input class="btn" type="button" name="" id="" value="43" />
										<input class="btn" type="button" name="" id="" value="43.5" />
										<input class="btn" type="button" name="" id="" value="44" />
										<input class="btn" type="button" name="" id="" value="44.5" />
										<input class="btn" type="button" name="" id="" value="45" />
									</p>
								</div>
								<div class="howmuch">
										<span class="i-wantbuy">我要买</span>
										<input class="minus" type="button" id="" value="-" />
										<input class="many" type="text" id="" value="1" />
										<input class="add" type="button" id="" value="+" />
										<a href="#" class="duizhaobiao">查看尺寸对照表</a>
										<div class="addcar">
											<span class="shopnow" href="">立即购买</span>
											<a class="cart" >加入购物车</a>
										</div>
									</div>`
								$("#product .guige").append(str2)
							}
						});
					})
					$(".guige").on("click",".shopnow",function(){
						location.href ="../html/login.html";

					})

					//点击图片切换
					$(".guige").on("click", ".xzimg", function() {
						$(this).addClass("active").siblings().removeClass("active")
						var str3 = ""
					str3 = `<div class="smallImg" style="background-image:url(${this.src});">						
						<div class="smallCursor"></div>`
					$("#product .product-top .imgbox-t").append(str3)
						$(".imgbox-t").empty();
						$(".imgbox-t").append(str3)
						
						var str4 = ""
						str4 += `   <img src="${this.src}"/>
									<img src="${this.src}"/>
									<img src="${this.src}"/>
									<img src="${this.src}"/>
									<img src="${this.src}"/>`
						$(".imgbox-b").empty();
						$(".imgbox-b").append(str4)
						
						var str5=""
						str5=`<img class="bigImg" src="${this.src}"/>`
						$(".bigCursor").empty();
						$(".bigCursor").append(str5)
				})
					//计算smallCursor的真实大小
					// 小方块的宽 =====  大方块的宽 / 大图片的宽 * 小图片的宽
					$(".smallCursor").width($(".bigCursor").width() / $(".bigImg").width() * $(".smallImg").width()-50);
					$(".smallCursor").height($(".bigCursor").height() / $(".bigImg").height() * $(".smallImg").height()-50);

					//大图小图的比例
					var scale = parseInt($(".bigImg").height() / $(".smallImg").height());
					
					
					//鼠标滑入此处用mousemove拿到e的坐标   ;滑出效果
					$(".imgbox").on("mousemove mouseout", ".smallImg", function(e) {
						if(e.type == "mousemove") {
							$(".smallCursor").show();
							$(".bigImg").show()
							
							var _left = e.pageX - $(this).offset().left - $(".smallCursor").width() / 2;
							

							var _top = e.pageY - $(this).offset().top - $(".smallCursor").height() / 2;
							$(".smallCursor").css({
								left: Math.min(Math.max(0, _left), $(".smallImg").width() - $(".smallCursor").width()),

								top: Math.min(Math.max(0, _top), $(".smallImg").height() - $(".smallCursor").height())
							})
							$(".bigImg").css({
								left: -$(".smallCursor").position().left * scale,
								top: -$(".smallCursor").position().top * scale
							})
						} else if(e.type == "mouseout") {
							$(".smallCursor").hide();
							$(".bigImg").hide()
						}
					})
				}
			});
			$(".guige").on("click",".cart",function(){
				$(".tck").show()
			})
			//弹出框设置关闭
			$(".close,#btn1").click(function(){
				$(".tck").hide()
			})
			//点击结算,进入购物车页面             
			$("#btn2,.buycar").click(function(){
				location.href ="../html/shopcar.html";
			})
			//点logo回到首页
			$(".ln").click(function(){
				location.href ="../html/index.html";
			})
			//点击结算，存cookie
			$("#btn2,#btn1").click(function(){
//				在partNumber标签上获得商品id
				var id=$(".guige .guige-price").find(".partNumber .v").html()
				var num=parseInt($(".add-num").html())
				var size=$(".guige .size .btn.active").attr("value")
				console.log(size)
//				console.log(id)
			//存cookie
			//第一次存cookie，没有数据,创建数组
			
			shoppingCart=JSON.parse($.cookie("shoppingCart"))||[]
			if(shoppingCart.length<1){
				shoppingCart.push({
					id:id,
					num:num,
					size:size
				})
			}else{			//有数据
				var onOff=true;
				$.each(shoppingCart,function(index,value){
					if(value.id==id){		//如果发现数据存在，就是老数据，数量++
						shoppingCart[index].num+=num
						onOff=false;
					}
				})
				if(onOff){//新数据
					shoppingCart.push({
						id:id,
						num:num,
						size:size
					})
				}
			}
			$.cookie("shoppingCart",JSON.stringify(shoppingCart),{expires:7})
				console.log(JSON.parse($.cookie("shoppingCart")))
				
			})
		
			
			
			$(".close").mousemove(function(){
				$(this).css("cursor","pointer")
			})
			//设置button边框
			$(".guige").on("click",".btn",function(){
				
				$(this).addClass("active").siblings().removeClass("active")
			})
			//设置input+-
			$(".guige").on("click",".add",function(e){
				var t=$(".many")
				if(e.value="add"){
					t.val(parseInt(t.val())+1)	
					
				}
			})
			$(".guige").on("click",".minus",function(){
				var t=$(".many")
				console.log(t)
				if(parseInt(t.val())<=1){				
				}else{
					t.val(parseInt(t.val())-1)
				}
			})
			//点击渲染弹出框数据
			$(".guige").on("click",".cart",function(){
				//数量 
				var m=parseInt($(".many").val())
				$(".num").html(m)
				$(".add-num").html(m)
				//价格
				var totalmoney=parseInt($(".offerPrice .v").html())*m
				$(".total-money").html(totalmoney)
				//图片和标题
				$(".content-l img").attr("src",$('.xzimg.active').attr('src')) 
				var title=$(".guige .biaoti").html()
				$(".content-r .title").html(title)
			})

			
		})
	})
})