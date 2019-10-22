const fs = require('fs');
const path = require('path');
const sha1 = require('sha1');
const express = require('express');
const router = express.Router();
const RootModel = require('../models/roots');

router.get('/',function (req,res,next) {
    res.render('addroot')
});

router.post('/',function (req,res,next) {
    const formData = req.fields;
    const name = formData.name;
    const gender = formData.gender;
    const avatar =req.files.avatar.path.split(path.sep).pop();
    let password = formData.password;
    // console.log(req.files);
    // res.json('测试');
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
    if(req.files.avatar.size===0){
        return res.json('缺少头像');
    }
    //所有添加信息正确
    //对密码加密
    password =sha1(password);
    let root = {
        name:name,
        password:password,
        gender:gender,
        avatar:avatar
    };

    RootModel.create(root)
        .then(function (result) {
            root = result.ops[0];
            delete root.password;
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
module.exports=router;