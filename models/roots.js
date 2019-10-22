const Root = require('../lib/mongo').Root;


module.exports = {
    //添加超级管理员
    create:function create(root) {
        return Root.create(root)
            .exec()
    },
    //通过用户名找到超级管理员
    getRootByName:function getAdminByName(name) {
        return Root
            .findOne({name:name})
            .exec()
    },
    //    更新超级管理员信息
    updateRootInfo:function updateRootInfo(name,data) {
        return Root.update({name:name},{$set:data}).exec();
    }
};