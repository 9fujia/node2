var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');
var filemd = require('./../tool/file');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var upload_iphone = multer({ dest: 'uploads/iphone' })
var fs = require('fs');         
var path = require('path')
/* GET users listing. */
router.get('/', function(req, res, next) {
  if (!req.cookies.isLogin || req.cookies.isLogin == 0) { // 表示未登录
    res.redirect('/login'); // 跳转到登录页面
    return; // 代码将不再继续往下执行
  }
	let { pageCode, pageNumber } = req.query;
	pageCode = pageCode * 1 || 1; // 默认是第一页
	pageNumber = pageNumber * 1 || 8; // 默认每页显示8条数据
	sql.find('fj', 'product', {}).then(data => {
		const totalNumber = Math.ceil(data.length / pageNumber);
		data = data.splice((pageCode -  1) * pageNumber, pageNumber)
		sql.distinct('fj', 'product', 'price').then(priceArr => {
			res.render('product', { 
				activeIndex: 3,
				totalNumber,
				pageNumber,
				pageCode,
				data,
				priceArr
			
			});
		})
	}).catch(err => {
		console.log(err)
	})
});
// 导入功能

/* GET home page. */
router.post('/uploadPro', upload.single('avatar'), function (req, res, next) {
  // req.file 是 `avatar` 文件的信息
  // req.body 将具有文本域数据，如果存在的话
  console.log(req.file)
  /***
   * { fieldname: 'avatar',  // Field name 由表单指定  
        originalname: 'bg.jpg', // 用户计算机上的文件的名称
        encoding: '7bit', // 文件编码
        mimetype: 'image/jpeg', // 文件的 MIME 类型
        destination: 'uploads/', // 保存路径
        filename: 'cab1484ee459e72fe1dbc5d51b8b782e', // 保存在 destination 中的文件名	
        path: 'uploads\\cab1484ee459e72fe1dbc5d51b8b782e', // 已上传文件的完整路径
        size: 37241 } // 文件大小（字节单位）
   */
  const { originalname, filename } = req.file;
  const { username } = req.body;
  const arr = originalname.split('.');
  const type = arr[arr.length - 1];
  const realFileName = '/' + filename + '.' + type;  // 存入数据库
  const oldName = './uploads/' + filename;
  const newName = './uploads' + realFileName;
	fs.rename(oldName, newName, (err) => { // 本地要改名字，不改文件将不存在
		if (err) throw err;
		// var productxlsx = 'E:/node/day07_node/myapp/uploads'+realFileName;
		var productxlsx = path.resolve('uploads')+realFileName
		res.redirect('/product');
		router.get('/importProduct',(req, res, next) => {
			filemd.analysisdata(productxlsx).then(obj => {
				console.log(obj)
				const data = obj[0].data;
				const result = filemd.productfilterdata(data)
				sql.insert('fj', 'product', result).then(() => {
					res.redirect('/product')
				})
			})
		})
	})
})

//导出
router.get('/exportProduct', (req, res, next) => {
	const _headers =  [
		{caption:'id',type:'string'},
		{caption:'标题',type:'string'},
		{caption:'图片',type:'string'},
		{caption:'价格',type:'number'},
		{caption:'原价',type:'number'},
		{caption:'颜色',type:'string'},
		{caption:'库存',type:'number'},
		{caption:'品牌',type:'string'}];
		


	sql.find('fj', 'product', {}).then(data => {
		let alldata = new Array();
    data.map((item, index) => {
      let arr = [];
      arr.push(item.id);
      arr.push(item.title);
			arr.push(item.img);
			arr.push(item.price);
			arr.push(item.sale);
			arr.push(item.color);
			arr.push(item.count);
			arr.push(item.brand);
      alldata.push(arr);
		})
		const result = filemd.exportdata(_headers, alldata);
		res.setHeader('Content-Type', 'application/vnd.openxmlformats');
		res.setHeader("Content-Disposition", "attachment; filename=" + "test.xlsx");
		res.end(result, 'binary');
	})
})

router.get('/search', (req, res, next) => {
	const { id } = req.query;
	sql.find('fj', 'product', { id: eval('/'+id+'/') }).then(data => {
		// res.send(data)
		sql.distinct('fj', 'product', 'price').then(priceArr => {
			res.render('product', {
				activeIndex: 3,
				totalNumber: 1,
				pageCode: 1,
				data,
				pageNumber: data.length,
				priceArr
			})
		})
	})
})
//分类搜索
router.get('/brandSearch', (req, res, next) => {
	let { brand } = req.query;
	
	sql.find('fj', 'product', { brand }).then(data => {
		// res.send(data)
		sql.distinct('fj', 'product', 'brand').then(brandArr => {
			res.render('product', {
				activeIndex: 3,
				totalNumber: 1,
				pageCode: 1,
				data,
				pageNumber: data.length,
				brandArr
			})
		})
	})
})

router.get('/sort', (req, res, next) => {
	let { type, num } = req.query;
	let sortData = {};
	sortData[type] = num*1;
	sql.sort('fj', 'product', sortData).then(data => {
		// res.send(data)
		sql.distinct('fj', 'product', 'price').then(priceArr => {
			res.render('product', {
				activeIndex: 3,
				totalNumber: 1,
				pageCode: 1,
				data,
				pageNumber: data.length,
				priceArr
			})
		})
		
	})
})
//排序
router.get('/distinct', (req, res, next) => {
	sql.distinct('fj', 'product', 'price').then(priceArr => {
		res.send(priceArr)
	})
})

//添加产品
router.get('/add', function(req, res, next) {
  res.render('product_add', { 
		activeIndex: 3
	});
});
router.post('/addAction',upload_iphone.single('iphone'),function(req, res, next) {
	const { originalname, filename } = req.file;
    const { username } = req.body;
    // 取得文件的后缀名
    const arr = originalname.split('.');
    const type = arr[arr.length - 1];
    const realFileName = '/' + filename + '.' + type;  // 将服务器可以访问的名字存入数据库
    // 更改上传到服务器的图片的文件名字，默认是没有后缀的，一定要注意路径问题
    const oldName = './uploads/iphone/' + filename;
    const newName = './uploads/iphone' + realFileName;
	
	fs.rename(oldName, newName, (err) => { // 本地要改名字，不改文件将不存在
		if (err) throw err;
		// post 如何拿数据
		const obj = req.body;
		let { id,title,price,sale,color,brand,count } = req.body;
		let img = newName
		id = id + '';
		sql.find('fj', 'product', { id: id }).then(data => {
		   if (data.length == 0) {
			   // 表示没有查询到数据 --- 可以添加该产品 
			   sql.insert('fj', 'product', { id,title,img,price,sale,color,brand,count })
				   .then(() => {
					   res.redirect('/product');
				   })
				   .catch((err) => {
					   res.redirect('/product/add');
				   })
		   } else {
			   // 该用户已存在
			   res.redirect('/product/add');
		   }
		}).catch(err => {
			console.log(err)
			res.redirect('');
		})
	})
});
// 更新
router.post('/updateAction', function(req, res, next) {
	let { id, price, count,color,sale } = req.body;

  sql.update('fj', 'product', 'updateOne', { id }, {$set: { price, count, color, sale }})
  .then(() => {
	  res.redirect('/product?pageCode=' + pageCode);
  }).catch(err => {
	  res.redirect('/product');
  })
});
// 删除
router.get('/remove', function(req, res, next) {
	let { id } = req.query;
	
  sql.remove('fj', 'product', { id }).then(() => {
	res.redirect('/product');
  }).catch((err) => {
	  res.redirect('/product');
  })
});
module.exports = router;
