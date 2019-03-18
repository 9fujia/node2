
requirejs.config({
	//前台请求超时错误，默认为7s
	waitSeconds: 0,
	//加载jq插件先设置依赖jq
	shim: {
		cookie: {
		    deps: ['jquery']
		},
		validate:{
			deps: ['jquery']
		},
		validatezh:{
			deps: ['jquery']
		}
   	},
	paths : {
		"jquery" : "../scripts/libs/jquery-1.9.0",
		"swiper" : "../scripts/libs/swiper",
		"cookie" :"../scripts/libs/jquery.cookie",
		"validate" : "../scripts/libs/jquery.validate",
		"validatezh":"../scripts/libs/jquery.validate.messages_zh"
//		"migrate":"http://localhost:8000/scripts/libs/migrate"
	}
});