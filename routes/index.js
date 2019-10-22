module.exports= function (app) {
    app.get('/',function (req,res) {
         res.redirect('/posts');
    });
    // app.use('/addroot',require('./addroot'));
     app.use('/app',require('./app'));
     app.use('/signin',require('./signin'));
     app.use('/signout',require('./signout'));
     app.use('/posts',require('./posts'));
     app.use('/webinfo',require('./webinfo'));
     app.use('/signlog',require('./signlog'));
     app.use('/userinfo',require('./userinfo'));
     app.use('/repassword',require('./repassword'));
     app.use('/addart',require('./addart'));
     app.use('/artview',require('./artview'));
     app.use('/addadmin',require('./addadmin'));
     app.use('/adminlist',require('./adminlist'));

};