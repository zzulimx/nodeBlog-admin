const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;
const ArticleModel = require('../models/articles');

router.get('/',checkLogin,function (req,res,next) {
    res.render('artview');
});

router.get('/view',checkLogin,function (req,res,next) {

    let pageName =parseInt(req.query.pageName) ;
    let currPage = parseInt(req.query.currPage);

    ArticleModel.getAllArticle()
        .then(function (articles) {
            let start=0;
            let end=0;
            start = (currPage-1)*pageName;
            end = start+pageName;
            let tmp = articles.slice(start,end);
            let articleData ={
                code:0,
                msg:"",
                count:articles.length,
                data:tmp
            };
            res.json(articleData);
        })
        .catch(next);
});
module.exports = router;