const sha1 = require('sha1');
const AdminModel = require('../models/admins');
const RootModel = require('../models/roots');
const LogModel = require('../models/logs');
const express = require('express');
const router = express.Router();
const checkNotLogin = require('../middlewares/check').checkNotLogin;

//登录界面
router.get('/',checkNotLogin,function (req,res,next) {
    res.render('signin');
});

//登录验证
router.post('/',checkNotLogin,function (req,res,next) {
    //允许跨域地址
    // res.header('Access-Control-Allow-Origin','http://127.0.0.1:3002');
    // res.header('Access-Control-Allow-Credentials','true')

    let name =  req.fields.name;
    let password =  req.fields.password;


//    校验参数
    if(!name.length){
        return res.json('请填写用户名！');
    }
    if(!password.length){
        return res.json("请填写密码！");
    }

    //查找超级管理员表，判断是否为超级用户

    RootModel.getRootByName(name)
        .then(function (root) {
             if(!root){
                 //判断是否为普通管理员
                 AdminModel.getAdminByName(name)
                     .then(function (admin) {
                         //登录失败
                         if(!admin){
                             return res.json('用户名不存在');
                         }
                         if(sha1(password) !== admin.password){
                             delete admin.password;
                             return res.json('用户名或密码错误！');
                         }
                         //登陆成功
                         //删除敏感信息
                         let log = {
                             user:name,
                             avatar:admin.avatar
                         };
                         LogModel.addLog(log)
                             .then(function (result) {
                                 log = result.ops[0];
                             })
                             .catch(next);
                         delete admin.password;
                         req.session.admin = admin;
                         return res.json('登录成功！')
                     })
             }else{
                 if(sha1(password) !== root.password){
                     delete root.password;
                     return res.json('用户名或密码错误！');
                 }else{
                     //登陆成功
                     //删除敏感信息
                     let log = {
                         user:name,
                         avatar:root.avatar
                     };
                     LogModel.addLog(log)
                         .then(function (result) {
                             log = result.ops[0];
                         })
                         .catch(next);
                     delete root.password;
                     req.session.root = root;
                     return res.json('登录成功！')
                 }
             }
        })



});
module.exports=router;