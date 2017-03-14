var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/mypage',function(req,res,next){
	res.send('hello my world');
});

router.get('/reg',(req,res)=>{
	res.render('reg',{title:'注册'});
});

router.get('/login',(req,res)=>{
	res.render('login',{title:'登录'});
});

router.get('/post',(req,res)=>{
	res.render('post',{title:'发表'});
});

router.get('/logout',(req,res)=>{
	
});



module.exports = router;
