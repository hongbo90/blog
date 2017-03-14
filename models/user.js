var mongodb = require('./db');

function User(user){
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
};

module.exports = User;

User.prototype.save = function(callback){
	var user = {
		name:this.name,
		password:this.password,
		email:this.email
	};

	//打开数据库
	mongodb.open((err,db)=>{
		if(err){
			return callback(err);
		}

		db.collection('users',(err,collection)=>{
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.insert(user,{
				safe:true
			},(err,user)=>{
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,user[0]);
			});

		});
	});
}

User.get = (name,callback)=>{
	mongodb.open((err,db)=>{
		if(err){
			return callback(err);
		}

		db.collection('users',(err,collection)=>{
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.findOne({
				name:name
			},(err,user)=>{
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,user);
			});

		});

	});
}

