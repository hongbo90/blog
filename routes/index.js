var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
	User = require('../models/user.js');



module.exports = function(app){
	
  	/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.get('/mypage',function(req,res,next){
	res.send('hello my world');
});

app.get('/reg',(req,res)=>{
	res.render('reg',{title:'注册'});
});

app.post('/reg',(req,res)=>{
	var name = req.body.name,
		password = req.body.password,
		password_re = req.body['password-repeat'];

	if(password_re != password){
		req.flash('error','两次输入的密码不一致！');
		return res.redirect('/reg');
	}

	var md5 = crypto.createHash('md5'),
		passwrod = md5.update(req.body.password).digest('hex');
	var newUser = new User({
		name:name,
		password:password,
		email:req.body.email
	});

	User.get(newUser,(err,user)=>{
		if(err){
			req.flash('error',err);
			console.log("error");
			return res.redirect('/');
		}

		if(user){
			req.flash('error','用户已存在！');
			console.log('用户已存在');
			return res.redirect('/reg');
		}

		newUser.save((err,user)=>{
			if(err){
				req.flash('error',err);
				return res.redirect('/reg');
			}
			console.log('注册成功');
			req.session.user = newUser;
			req.flash('success','注册成功');
			res.redirect('/');
		});

	});

});

app.get('/login',(req,res)=>{
	res.render('login',{title:'登录'});
});

app.get('/post',(req,res)=>{
	res.render('post',{title:'发表'});
});

app.get('/logout',(req,res)=>{
	
});

};
