const express = require('express');
const router = express.Router();
const ArticleModel = require('../models/articles');

//全部文章页
router.get('/',function (req,res,next) {

   if( req.query.currPage){
       let limit = req.query.limit;
       let currPage =req.query.currPage;
       // console.log(limit);
       // console.log(currPage);
       ArticleModel.getAllArticle()
           .then(function (articles) {
               articles.forEach(function (item,index) {
                   let year = articles[index].createdAt.getFullYear();
                   let month = articles[index].createdAt.getMonth()+1;
                   let date = articles[index].createdAt.getDate();
                   let hour = ('000'+articles[index].createdAt.getHours()).slice(-2);
                   let minu = ('000'+articles[index].createdAt.getMinutes()).slice(-2);
                   let sec = ('000'+articles[index].createdAt.getSeconds()).slice(-2);
                   let create_time = year + '-' + month + '-' + date +  '  ' + hour + ':' + minu + ':' + sec;
                   articles[index].createdAt = create_time;
               });
               let countNum = articles.length;
               let start = (currPage - 1)*limit;
               let end = start + limit;
               articles=articles.slice(start,end);
               let artNum = articles.length;
               return res.json({
                   articles:articles,
                   artNum:artNum,
                   countNum:countNum
               });

           });
   }else{
       ArticleModel.getAllArticle()
           .then(function (articles) {
               articles.forEach(function (item,index) {
                   let year = articles[index].createdAt.getFullYear();
                   let month = articles[index].createdAt.getMonth()+1;
                   let date = articles[index].createdAt.getDate();
                   let hour = ('000'+articles[index].createdAt.getHours()).slice(-2);
                   let minu = ('000'+articles[index].createdAt.getMinutes()).slice(-2);
                   let sec = ('000'+articles[index].createdAt.getSeconds()).slice(-2);
                   let create_time = year + '-' + month + '-' + date +  '  ' + hour + ':' + minu + ':' + sec;
                   articles[index].createdAt = create_time;
                   // console.log( hour)
               });

               let countNum = articles.length;

               articles=articles.slice(0,10);
               let artNum = articles.length;
               return res.render('app',{
                   articles:articles,
                   artNum:artNum,
                   countNum:countNum
               });

           });
   }
});


//查看文章
router.get('/:postId',function (req,res,next) {
    // console.log(req)
     let postId = req.params.postId;
      ArticleModel.getArticleById(postId)
          .then(function (result) {
              // console.log(result);
              return res.redirect('back')
          })
          .catch(next)

});

module.exports=router;