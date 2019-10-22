const express = require('express');
const sha1 = require('sha1');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;
const AdminModel = require('../models/admins');
const RootModel = require('../models/roots');

router.get('/',checkLogin,function (req,res,next) {
    res.render('repassword');
});
router.post('/pwdreset',checkLogin,function (req,res,next) {
       let oldpassword = req.fields.oldpassword;
       let newpassword = req.fields.newpassword;
       let repassword = req.fields.repassword;

       if(req.session.root){
           //获取当前用户信息
           RootModel.getRootByName(req.session.root.name)
               .then(function (root) {
                   if(sha1(oldpassword) !== root.password){
                       delete root.password;
                       return  res.json("原密码错误，请重试！");
                   }
                   if(newpassword!==repassword){
                       delete root.password;
                       return res.json("两次密码不一致,请重新输入！");
                   }else if(newpassword.length<6){
                       delete root.password;
                       return res.json("新密码不足6个字符，请重新输入！");
                   }
                   RootModel.updateRootInfo(req.session.root.name,{
                       password:sha1(newpassword)
                   })
                       .then(function (result) {
                           if(result){
                               req.session.root = null;
                               return res.json('密码修改成功，请重新登录!');
                           }
                       })
               })
       }else{
           //获取当前用户信息
           AdminModel.getAdminByName(req.session.admin.name)
               .then(function (admin) {
                   if(sha1(oldpassword) !== admin.password){
                       delete admin.password;
                       return  res.json("原密码错误，请重试！");
                   }
                   if(newpassword!==repassword){
                       delete admin.password;
                       return res.json("两次密码不一致,请重新输入！");
                   }else if(newpassword.length<6){
                       delete admin.password;
                       return res.json("新密码不足6个字符，请重新输入！");
                   }
                   AdminModel.updateAdminInfo(req.session.admin.name,{
                       password:sha1(newpassword)
                   })
                       .then(function (result) {
                           if(result){
                               req.session.admin = null;
                               return res.json('密码修改成功，请重新登录!');
                           }
                       })
               })
       }


});
module.exports = router;