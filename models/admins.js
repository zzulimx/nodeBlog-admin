const Admin = require('../lib/mongo').Admin;

//向数据库中添加管理员
module.exports={
//    添加管理员
    create:function create(admin) {
        return Admin.create(admin).exec();
    },
    //通过用户名找到管理员
    getAdminByName:function getAdminByName(name) {
        return Admin
            .findOne({name:name})
            .exec()
    },
//查询所有管理员
    getAllAdmin:function getAllAdmin() {
        return Admin
            .find()
            .sort({_id:-1})
            .exec()
    },
//    更新管理员信息
    updateAdminInfo:function updateAdminInfo(name,data) {
         return Admin.update({name:name},{$set:data}).exec();
    },
//    删除管理员
    deleteAdmin:function deleteAdmin(name) {
        return Admin
            .deleteOne({name:name})
            .exec()

    }
};