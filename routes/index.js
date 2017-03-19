var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
	User = require('../models/user.js'),
	Post = require('../models/post.js');



module.exports = function(app){
	
	app.get('/', function(req, res, next) {
		Post.get(null,(err,posts)=>{
			if(err){
				posts = [];
			}
			res.render('index', { 
		 		title: '主页',
		 		user:req.session.user,
		 		success:req.flash('success').toString(),
		 		error:req.flash('error').toString(),
		 		posts:posts
			});
		}); 	
	});

	app.get('/reg',checkNotLogin);
	app.get('/reg',(req,res)=>{
		res.render('reg',{
			title:'注册',
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('success').toString()
		});
	});

	app.post('/reg',checkNotLogin);
	app.post('/reg',(req,res)=>{
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'];

		if(password_re != password){
			req.flash('error','两次输入的密码不一致！');
			console.log('不一致');
			return res.redirect('/reg');
		}

		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
			console.log(password);
		var newUser = new User({
			name:name,
			password:password,
			email:req.body.email
		});

		User.get(newUser.name,(err,user)=>{
			if(err){
				req.flash('error',err);
				console.log("error：",err);
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

	app.get('/login',checkNotLogin);
	app.get('/login',(req,res)=>{
		console.log('这是登录页面');
		console.log(req.session.user);
		console.log(req.flash('success').toString());
		console.log(req.flash('error').toString());
		res.render('login',{
			title:'登录',
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString
		});
	});

	app.post('/login',checkNotLogin);
	app.post('/login',(req,res)=>{
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');

			User.get(req.body.name, (err,user)=>{
				if(!user){
					req.flash('error','用户不存在');
					return res.redirect('/login');
				}

				console.log(user.password,password);

				if(user.password != password){
					req.flash('error','密码错误');
					return res.redirect('/login');
				}

				req.session.user = user;
				req.flash('success','登录成功');
				res.redirect('/');

			});
	});

	app.get('/post', checkLogin);
  	app.get('/post', function (req, res) {
		res.render('post', {
			title: '发表',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
	    });
	});

	app.post('/post',checkLogin);
	app.post('/post',(req,res)=>{
		var currentUser = req.session.user,
			post = new Post(currentUser.name, req.body.title, req.body.post);
		post.save((err)=>{
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}
			req.flash('success','发布成功');
			res.redirect('/');
		})	
	});

	app.get('/logout',checkLogin);
	app.get('/logout',(req,res)=>{
		req.session.user = null;
		req.flash('success','登出成功');
		res.redirect('/');
	});

	function checkLogin(req,res,next){
		if(!req.session.user){
			req.flash('error','未登錄');
			console.log('未登錄');
			res.redirect('/login');
		}
		next();
	}

	function checkNotLogin(req,res,next){
		console.log('checkNotLogin yidenglu');
		if(req.session.user){
			req.flash('error','已登录');
			console.log('已登录 checkNotLogin');
			res.redirect('back');
		}
		next();
	}

};
