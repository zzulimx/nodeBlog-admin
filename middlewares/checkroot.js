module.exports={
    checkRoot:function checkRoot(req,res,next) {
        if(!req.session.root){
           return res.send('您没有权限查看该页！');
        }
        next();
    }
};