const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;


router.get('/',checkLogin,function (req,res,next) {
    if(req.session.root){
       return res.render('posts',{
            name:req.session.root.name,
            gender:req.session.root.gender,
            avatar:req.session.root.avatar
        });
    }
    res.render('posts',{
        name:req.session.admin.name,
        gender:req.session.admin.gender,
        avatar:req.session.admin.avatar
    });

});

module.exports = router;