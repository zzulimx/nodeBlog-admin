const Log = require('../lib/mongo').Log;


module.exports = {

    //添加登录日志
    addLog: function addLog(log) {
        return Log.create(log).exec();
    },
//    获取登录日志所有信息
    getAllLogs: function getAllLogs() {
        return Log
            .find()
            .sort({_id:-1})
            .exec();
    }
};