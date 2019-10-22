module.exports = {
    port : 3002,  //程序启动监听端口号
    session:{
        secret:'nodeBlog',
        key:'nodeBlog',
        maxAge:2592000000   //cookie保存时间
    },
    db:'node_blog',  //数据库名
    mongodb:'mongodb://localhost:27017/node_blog'
}