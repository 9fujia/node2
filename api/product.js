var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');
var filemd = require('./../tool/file');
/* GET users listing. */
router.get('/', function(req, res, next) {

	let { pageCode, pageNumber } = req.query;
	pageCode = pageCode * 1 || 1; // 默认是第一页
	pageNumber = pageNumber * 1 || 8; // 默认每页显示8条数据
	sql.find('fj', 'product', {}).then(data => {
		const totalNumber = Math.ceil(data.length / pageNumber);
		data = data.splice((pageCode -  1) * pageNumber, pageNumber)
		res.send({
			code: 200,
			message: 'success',
			data: data
		})
	}).catch(err => {
		console.log(err)
	})
});
// 导入功能
const productxlsx = "E:/三阶段/day07/myapp/pro.xlsx";

router.get('/importProduct', (req, res, next) => {
	filemd.analysisdata(productxlsx).then(obj => {
		console.log(obj)
		const data = obj[0].data;
		const result = filemd.productfilterdata(data)
		
		sql.insert('fj', 'product', result).then(() => {
			res.redirect('/product')
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
		res.send({
			code: 200,
			message: 'success',
			data: data
		})
	})
})
//分类搜索
router.get('/brandSearch', (req, res, next) => {
	let { brand } = req.query;
	
	sql.find('fj', 'product', { brand }).then(data => {
		// res.send(data)
		res.send({
			code: 200,
			message: 'success',
			data: data
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
router.post('/addAction', function(req, res, next) {
	// { tel: tel}    { tel }
 // post 如何拿数据
 // const obj = req.body;
 let { id,title,img,price,sale,color,brand,count } = req.body;
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
 // console.log(obj);
 
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
module.exports = router;
