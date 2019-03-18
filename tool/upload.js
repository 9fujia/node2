var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer  = require('multer');

var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join('uploads',file.fieldname))
    },
    filename: function(req,file,cb){
        cb(null,Date.now() + '-'+ file.originalname);
    }
});

//创建文件夹

var createFolder = function(folder){
    try{
        fs.accessSync(folder);

    }catch(e) {
        fs.mkdirSync(folder)
    }
};
var upload = multer({ storage: storage });

router.post('/', upload.single('file'), function(req, res, next) {
    var file = req.file;
    res.json({res_code: '0'});
})
module.exports = router;