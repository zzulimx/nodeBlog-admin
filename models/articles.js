const  Article = require('../lib/mongo').Article;


module.exports= {
//    添加新文章
      create:function create(article) {
        return Article.create(article).exec();
    },

//    查找所有文章
     getAllArticle:function getAllArticle() {
         return Article
             .find()
             .sort({_id:-1})
             .exec()
     },
//     根据id获取一篇文章
    getArticleById:function getArticleById(postId) {
         return Article
             .findOne({_id:postId})
             .exec()
    }
};