/**
 * New node file
 */
var formidable=require('formidable');
var db=require('../models/db.js');
var md5 = require('md5');
var path=require('path');
var fs=require('fs');
var gm=require('gm');





exports.showIndex=function(req,res){
	if(req.session.login==1){
		db.find('user',{'name':req.session.uname},function(err,result){
			var avatar=result[0].avatar || 'default.jpg';
			res.render('index',{
				'login':req.session.login || 0,
				'uname':req.session.uname||'',
				'current':'index',
				'avatar':avatar||'default.jpg'
			});
		})
	}else{
		res.render('index',{
				'login':req.session.login || 0,
				'uname':req.session.uname||'',
				'current':'index',
				'avatar':'default.jpg'
			});
	}
	
	
}

exports.showRegister=function(req,res){
	res.render('register',{
		'login':req.session.login || 0,
		'uname':req.session.uname||'',
		'current':'register'
	});
}

exports.doRegister=function(req,res){
	var form = new formidable.IncomingForm();
 
    form.parse(req, function(err, fields, files) {
     var uname=fields.uname;
     var upwd=md5(md5(fields.upwd)+'lei');
     var time=fields.time;
     db.find('user',{'name':uname},function(err,result){
     	if(err){
     		console.log('查询失败');
     	}else if(result.length!=0){
     		res.send({'result':-1});
     	}else{
     		db.insertOne('user',{'name':uname,'upwd':upwd,'time':time,'avatar':'default.jpg'},function(err,result){
     			req.session.login=1;
		     	req.session.uname=uname;
     			res.send({'result':1});
     		});
     	}
     	
     })
    });
}


exports.showLogin=function(req,res){
	res.render('login',{
		'login':req.session.login || 0,
		'uname':req.session.uname||'',
		'current':'login'
	});
}

exports.doLogin=function(req,res){
	var form = new formidable.IncomingForm();
 
    form.parse(req, function(err, fields, files) {
    	
	    var uname=fields.uname;
	    var upwd=md5(md5(fields.upwd)+'lei');
		    if(upwd&&uname){
		     	db.find('user',{'name':uname},function(err,result){
			     	if(err){
			     		console.log('查询失败');
			     	}else if(result.length==0){
			     		res.send({'result':-1});
			     	}else if(upwd!==result[0].upwd){
			     		res.send({'result':-2});
			     		return;
			     	}
			     	req.session.login=1;
			     	req.session.uname=uname;
			     	res.send({'result':1});
		     	});
		    }else{
	     		console.log('用户名或密码不能为空');
	     	}
     
	});
     
}

exports.setAvatar=function(req,res){
	res.render('setAvatar',{
		'login':req.session.login || 0,
		'uname':req.session.uname||'',
		'current':'index',
	});
}

exports.cutAvatar=function(req,res){
	var form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + "/../avatar");
    form.parse(req, function (err, fields, files) {
        var oldpath=files.avatar.path;
        var newpath=path.normalize(__dirname+"/../avatar/")+req.session.uname+path.extname(files.avatar.name);
        fs.rename(oldpath,newpath,function(err){
        	if(err){
        		console.log('改名失败');
        		return;
        	}
        	req.session.avatar=req.session.uname+path.extname(files.avatar.name);
        	res.redirect('/cut');
    	});
        
     });
}

exports.cut=function(req,res){
	res.render('cut',{
		'avatar':req.session.avatar
	});
}

exports.docut=function(req,res){
	
	var filename=req.session.avatar;
	var x=req.query.x;
	var y=req.query.y;
	var w=req.query.w;
	var h=req.query.h;
	var filepath=path.normalize(__dirname+"/../avatar/" + filename);
	console.log(filepath);
	
	gm(filepath).crop(w, h, x, y).write(filepath, function (err) {
            if (err) {
            	console.log(err);
                res.send("-1");
                return;
            }
            db.updateMany('user',{'name':req.session.uname},{$set:{'avatar':filename}},function(err){
            	res.send('1');
            })
            
            
    });
}
