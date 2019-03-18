require(["../scripts/config.js"], function() {
	require(["jquery", "swiper","cookie"], function($, Swiper,cookie) {
		$(function() {
			//滑过导航

			//左侧导航
			$(window).scroll(function() {
				var $t = $(this).scrollTop()
				if($t > 670) {
					$("#nav-left img").fadeIn(1000); //fadeIn 出现
				} else {
					$("#nav-left img").fadeOut(1000) //fadeOut 消失
				}
			})
			//实现手风琴轮播
			$(function() {
				var imgCounter = 6; //当前轮播图序号
				var timer = null;
				//初始化，将所有照片有序地放入img盒子里
				$('#lunbobox1 .lunbo').each(function(index) {
					$(this).css('left', index * 160);
				})
				$('#lunbobox2 .lunbo').each(function(index) {
					$(this).css('left', index * 170);
				})

				function rotation(counter) {
					$('#lunbobox1 .lunbo').eq(counter).stop().animate({
						left: counter * 160 + 'px'
					}, 500);
					$('#lunbobox2 .lunbo').eq(counter).stop().animate({
						left: counter * 170 + 'px'
					}, 500);
					//对当前图片的往后的所有图片进行重新定位
					$('#lunbobox1 .lunbo').eq(counter).nextAll().each(function(index) {
						$(this).stop().animate({
							left: 340 + counter * 160 + index * 160 + 'px' //具体的位置定位
						}, 500)
					})
					$('#lunbobox2 .lunbo').eq(counter).nextAll().each(function(index) {
						$(this).stop().animate({
							left: 340 + counter * 170 + index * 170 + 'px' //具体的位置定位
						}, 500)
					})
					//对当前图片的往前的所有图片进行重新定位
					$('li').eq(counter).prevAll().each(function(index) {
						$(this).stop().animate({
							left: (counter - index - 1) * 160 + 'px' //具体的位置定位
						}, 500);
					})
				}
				//手风琴轮播主要功能的实现
				$('#lunbobox1 .lunbo').mouseenter(function() {
					//获取鼠标当前的图片序号
					var idx = $('.lunbo').index(this);
					imgCounter = idx;
					rotation(idx);
					clearTimeout(timer);
					autoRotation();
				});

				$('#lunbobox2 .lunbo').mouseenter(function() {
					//获取鼠标当前的图片序号
					var idx = $('.lunbo').index(this);
					imgCounter = idx;
					rotation(idx);
					clearTimeout(timer);
					autoRotation();
				});
				//自动轮播
				function autoRotation() {
					timer = setTimeout(function() {
						if(imgCounter >= 6) {
							imgCounter = 0;
						} else {
							imgCounter++;
						}
						rotation(imgCounter);
						autoRotation();
					}, 1000);
				}
				autoRotation();
			})
			//nav鼠标滑过效果
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
			//点击显示二维码
			$("#zhugong").on("click",".bg",function(){
				$(this).find(".erweima").toggle()
				$(this).find("p").toggle()
			}
//				
			)
//			$("#zhugong .tab-p2 .goods .bg").hover(
//				function() {
//					$(this).find(".erweima").css("display", "block")
//					$(this).find("p").css("display", "block")
//				},
//				function() {
//					$(this).find(".erweima").css("display", "none")
//					$(this).find("p").css("display", "none")
//				}
//			)
			var mySwiper = new Swiper('.shoe_box', {
				autoplay: {
					delay: 800,
				},
				effect: 'fade',

			});
			var mySwiper = new Swiper('.banner4-lunbo-box', {
				autoplay: {
					delay: 500,
				},
				direction: 'vertical',
				loop: true,
			});
			var mySwiper = new Swiper('.clothes_box', {
				autoplay: {
					delay: 800,
				},
				effect: 'fade',

			});
			//渲染页面#tab-p2
			$.ajax({
				url: "http://47.102.141.79/api/product?pageNumber=50",
				success: function(data) {
					console.log(data)
					var str1 = ""
					for(var i = 0; i < 15; i++) {
						str1 += `<div class="tab-p2-goods" index="${data.data[i].id}">
					
								<img src="${data.data[i].img}"/>
								<div class="goods-name">
									${data.data[i].title}
								</div>
								<span class="rmb">¥</span>
								<span class="price">${data.data[i].price}</span>
								<a href="http://47.102.141.79/template/html/particulars.html"><img class="buyitnow" src="../static/img/buyitnow.png" style="width: 65px;height: 16px;"/></a>
							</div>`
					};
					
					$("#tab-p2").append(str1)
					
					var str2="";
					for (var j=0;j<10;j++) {
						str2+=`<div class="goods">
									<div class="bg">
										<img src="${data.data[j].img}"/>
										<img class="erweima" src="../static/img/erweima.png"/>
										<p>微信扫码立即开团</p>
									</div>
									<div class="info">
										<div class="info-t">
											<span>¥</span>
											<span class="money">${data.data[j].price}</span>
											<img class="pingtuanshu" src="https://cdns.lining.com/postsystem/docroot/images/cps/bs0522/guoqing/pc_lrt.png"/>
										</div>
										<div class="info-b">
											<span class="danmaijg">单买价格:</span>
											<span class="danmai_money">${data.data[j].sale}</span>
										</div>
										<img class="qupingtuan" src="https://cdns.lining.com/postsystem/docroot/images/cps/bs0522/guoqing/pc_qkt.png"/>
									</div>
								</div>`
					}
					$(".tab-p1").append(str2)
				}
			});
			//点击获取cookie
			$("#tab-p2").on("click",".buyitnow",function(){
				var id=$(this).parent().parent().attr("index")
				
				//第一次存cookie，没有数据,创建数组
//				
				goods=JSON.parse($.cookie("goods")) || [];
				//存cookie之前先删除
					goods.shift()
					//每次只添加当前存的货号
					goods.push({
						id:id
					})
					
					
				$.cookie("goods",JSON.stringify(goods),{expires:7})
				
				console.log($.cookie("goods"))
			})
			$.ajax({
				url:"http://47.102.141.79/api/product?pageNumber=50",
				success:function(data){
					var str3="";
					for (var i=0;i<10;i++) {
						str3+=`<div class="goods">
									<div class="bg">
										<img src="${data.data[i].img}"/>
										<img class="erweima" src="../static/img/erweima.png"/>
										<p>微信扫码立即开团</p>
									</div>
									<div class="info">
										<div class="info-t">
											<span>¥</span>
											<span class="money">${data.data[i].price}</span>
											<img class="kan" src="https://cdns.lining.com/postsystem/docroot/images/cps/bs0522/guoqing/pc_lrt.png"/>
										</div>
										<div class="info-b">
											<span class="danmaijg">单买价格:</span>
											<span class="danmai_money">${data.data[i].sale}</span>
										</div>
										<img class="qukanjia" src="https://cdns.lining.com/postsystem/docroot/images/cps/bs0522/guoqing/pc_qkt.png"/>
									</div>
								</div>`
					}
					$(".tab-p2").append(str3)
				}
			});
			
			//进入商品详情页(js中的事件委托机制,解决动态生成的dom元素无法绑定事件的问题)
			$("#tab-p2").on("click", ".buyitnow", function() {
//				console.log(this)
			})
			$(".buycar").click(function(){
				location.href ="../html/shopcar.html";

			})
			var mySwiper = new Swiper('.banner1-lunbo-box', {
				autoplay: {
					delay: 2000, //1秒切换一次
				},
				autoplay:false,
				loop: true,
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
			});
			$(".ln").click(function(){
				location.href ="../html/index.html";
			})
		})
	})
})

//require(["../../scripts/config.js"],function(){
//	require(["jquery","swiper"],function($,Swiper){
//		$(function(){
//			//准备要写的jq代码
//		})
//	})
//})