const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;

let ArticleModel = require('../models/articles');

router.get('/',checkLogin,function (req,res,next) {
    res.render('addart');
});

router.post('/add',checkLogin,function (req,res,next) {
   let title = req.fields.title;
   let content = req.fields.content;

   var create_admin;
   if(req.session.root){
       create_admin = req.session.root.name;

   }else {

       create_admin = req.session.admin.name;
   }

   let article = {
       title:title,
       content:content,
       createAdmin:create_admin
   };
   
   ArticleModel.create(article)
       .then(function (result) {
           art = result.ops[0];
           return res.json('添加成功');
       })
       .catch(function (e) {
           console.log(e);
           return res.json('添加失败')
       })
});

module.exports = router;