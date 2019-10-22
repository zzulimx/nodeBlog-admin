const path = require('path');
const express = require('express');
const cors = require('cors');  //跨域模块
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('config-lite')(__dirname);
const routes = require('./routes');
const pkg = require('./package');

var app = express();

//解决跨域
app.use(cors());
//设置模板根目录
app.set('views',path.join(__dirname,'views'));

//设置模板引擎
//注意是view不是views
app.set('view engine','ejs');

//设置静态文件目录
app.use(express.static(path.join(__dirname,'public')));

//session中间件支持会话机制
app.use(session({
    name:config.session.key, //设置cookie中保存的session id的字段名称
    secret:config.session.secret, //通过secret计算hash值并放置在cookie中，使产生的signedcookie放篡改
    cookie: {
        maxAge:config.session.maxAge  //过期时间 过期后cookie中的session-id自动删除
    },
    store:new MongoStore({ //session存放到mongoDB中
        db:config.db,
        url:config.mongodb //mongodb地址
    })
}));

//处理表单及文件上传的中间件
app.use(require('express-formidable')({
    uploadDir:path.join(__dirname,'public/img'), //上传文件目录
    keepExtensions:true// 保留文件后缀
}));





//路由
routes(app);

//监听端口，启动程序
app.listen(config.port,function () {
    console.log(`${pkg.name} listening on port ${config.port}`  );
});
