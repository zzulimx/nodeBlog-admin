module.exports={
    checkLogin: function checkLogin(req,res,next) {
        if((!req.session.admin) && (!req.session.root)){
            return res.redirect('/signin');
        }
        next();
    },
    checkNotLogin: function checkNotLogin(req,res,next) {
        if(req.session.admin){
            return res.redirect('posts');
        }
        next();
    }
};