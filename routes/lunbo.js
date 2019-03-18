var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');
var filemd = require('./../tool/file');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({ dest: 'uploads/banner' })
var path = require('path');
let fs = require('fs');





/* GET users listing. */
router.get('/', function(req, res, next) {
	sql.find('fj', 'imgs', {}).then(data => {
		res.render('lunbo', { 
			activeIndex: 4,
			data    //  < == > data: data
		});
	}).catch(err => {
		console.log(err)
	})
});

router.get('/add', function(req, res, next) {
  res.render('lunbo_add', { 
		activeIndex: 4
	});
});

//multer有single()中的名称必须是表单上传字段的name名称。
router.post('/addAction',upload.single('banner'),function(req, res, next) {
	console.log(req.file);
	console.log(req.body);
	//上传图片功能
	var storage = multer.diskStorage({
		destination: function(req,file,cb){
			cb(null,path.join('uploads',file.fieldname))
		}
	});
	var upload = multer({ storage: storage });
	// 图片改名
	const { originalname, filename } = req.file;
	const arr = originalname.split('.');
	const type = arr[arr.length - 1];
	const realFileName = '/' + filename + '.' + type; //完整文件名
	const oldName = './uploads/banner/' + filename;
	const newName = './uploads/banner' + realFileName;
	console.log(oldName)
	console.log(newName)
	fs.rename(oldName, newName, (err) => { //改名
		if (err) throw err;
	//上传整个文件
	// post 如何拿数据
		let { id,title} = req.body;
		id *= 1;
		sql.find('fj', 'imgs', { id: id }).then(data => {
			if (data.length == 0) {
				// 表示没有查询到数据 --- 可以添加该图片 			
				sql.insert('fj', 'imgs', { id,title,newName})
					.then(() => {
						res.redirect('/lunbo');
					})
					.catch((err) => {
						res.redirect('lunbo/add');
					})
			} else {
				// 图片已存在
				res.redirect('/lunbo/add');
			}
		}).catch(err => {
			console.log(err)
			res.redirect('/lunbo/add');
		})
	});
})

module.exports = router;