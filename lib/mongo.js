const config = require('config-lite');
const Mongolass = require('mongolass');
const mongolass = new Mongolass();
mongolass.connect(config.mongodb);



//创建超级管理员
exports.Root = mongolass.model('Root',{
    name:{type:'string'},
    password:{type: 'string'},
    gender:{type:'string',enum:['m','f','x']},
    avatar:{type:'string'}
});

//创建后台管理员集合
exports.Admin = mongolass.model('Admin',{
    name:{type:'string'},
    password:{type: 'string'},
    gender:{type:'string',enum:['m','f','x']},
    avatar:{type:'string'}
});

//创建登录日志集合
exports.Log = mongolass.model('Log',{
    user:{type:'string'},
    avatar:{type:'string'},
    createdAt: { type: Mongolass.Types.Date, default: Date.now }
});

//创建文章集合
exports.Article = mongolass.model('Article',{
    title:{type:'string',required:true},
    content:{type:'string',required:true},
    comment:{type:'object',required:false},
    createAdmin:{type:'string',required:true},
    createdAt: { type: Mongolass.Types.Date, default: Date.now },
    pv:{type:'number',default:0}
});
exports.Root.index({name:1},{unique:true}).exec();
exports.Admin.index({name:1},{unique:true}).exec();
exports.Log.index({user:1,_id:-1}).exec();  //根据用户名找到用户 ，按登陆时间降序查看
exports.Article.index({_id:1,name:1}).exec();