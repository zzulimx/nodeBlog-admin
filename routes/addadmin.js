const fs = require('fs');
const path = require('path');
const sha1 = require('sha1');
const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;
const checkRoot = require('../middlewares/checkroot').checkRoot;

var AdminModel = require('../models/admins');
router.get('/',checkLogin,checkRoot,function (req,res,next) {
    res.render('addadmin');
});

router.post('/',checkLogin,checkRoot,function (req,res,next) {
    const formData = req.fields;
    const name = formData.name;
    const gender = formData.gender;
    const avatar =req.files.avatar.path.split(path.sep).pop();
    let password = formData.password;
    const repassword = formData.repassword;

    //校验参数
        if(!(name.length >= 1 && name.length <= 10)){
            //此时需要异步删除保存的头像
            fs.unlink(req.files.avatar.path,function (err) {
                // console.log('图片删除失败');
            });
            return res.json("用户名请限制在1-10个字符");
            //此时需要异步删除保存的头像

        }
       if(password.length<6){
              //此时需要异步删除保存的头像
             fs.unlink(req.files.avatar.path,function (err) {
            // console.log('图片删除失败');
             });
            return res.json("密码不少于6个字符")
        }
             if(password!==repassword){
             //此时需要异步删除保存的头像
             fs.unlink(req.files.avatar.path,function (err) {
            // console.log('图片删除失败');
             });
             return res.json("两次输入的密码不一致")
        }
        if(!avatar.length){
             return res.json('缺少头像');
        }


        //所有添加信息正确
        //对密码加密
       password =sha1(password);
        //待写入数据库的信息
        let admin = {
            name:name,
            password:password,
            gender:gender,
            avatar:avatar
        };
      AdminModel.create(admin)
          .then(function (result) {
              admin = result.ops[0];
              //删除密码这种敏感信息
              delete admin.password;
              if(!req.session.root){
                  req.session.admin = admin;
              }
             return res.json('添加成功');
          })
          .catch(function (e) {
              //注册失败，异步删除刚保存的头像
              fs.unlink(req.files.avatar.path,function (err) {

              });
                if(e.message.match('duplicate key')){
                    //已定义用户名唯一，duplicate -->重复
                    //用户名重复了
                    res.json('用户名已被占用');
                }

                next(e);
          })


});

module.exports = router;