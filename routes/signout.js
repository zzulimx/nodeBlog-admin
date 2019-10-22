const checkLogin = require('../middlewares/check').checkLogin;
const express = require('express');
const router = express.Router();

router.get('/',checkLogin,function (req,res,send) {
          req.session.admin=null;
          req.session.root=null;

     res.redirect('/signin');
});

//路由模块导出
module.exports=router;