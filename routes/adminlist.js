const checkLogin= require('../middlewares/check').checkLogin;
const checkRoot = require('../middlewares/checkroot').checkRoot;
const AdminModel = require('../models/admins');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const sha1 = require('sha1');

//管理员列表页面
router.get('/',checkLogin,checkRoot,function (req,res,next) {
    res.render('adminlist');
});

// 列表数据
router.get('/listdata',checkLogin,checkRoot,function (req,res,next) {
    //取参数
    let pageName =parseInt(req.query.pageName) ;
    let currPage = parseInt(req.query.currPage);
    AdminModel.getAllAdmin()
        .then(function (admins) {
            let start=0;
            let end=0;
            start = (currPage-1)*pageName;
            end = start+pageName;
            let tmp = admins.slice(start,end);
            let adminData ={
                code:0,
                msg:"",
                count:admins.length,
                data:tmp
            };
            res.json(adminData);
        })
        .catch(next);

});

//编辑管理员
router.post('/editadmin',checkLogin,checkRoot,function (req,res,next) {
    let currname=req.fields.currname;
    let name = req.fields.name;
    let password = req.fields.password;
    let gender = req.fields.gender;
    var avatar ='';
    if(req.files.avatar.size===0){
        //异步删除保存的头像
            fs.unlink(req.files.avatar.path,function (error) {
                if(error){
                    console.log("本地删除失败");
                }
            });

    }else{
       avatar = req.files.avatar.path.split(path.sep).pop();
    }
    password = sha1(password);
    let newAdmin = {
        name:name,
        gender:gender,
        password:password
    };
    if(avatar!== ''&& avatar !==null){
        newAdmin.avatar = avatar;
    }
AdminModel.updateAdminInfo(currname,newAdmin)
    .then(function (admin) {
        if(admin){
            return res.json('修改成功')
        }
    })
    .catch(function (e) {
        //注册失败，异步删除刚保存的头像
        if(req.files.avatar.size!==0){
            fs.unlink(req.files.avatar.path,function (err) {
            });
        }
        if(e.message.match('duplicate key')){
            //已定义用户名唯一，duplicate -->重复
            //用户名重复了
            return res.json('用户名已被占用');
        }

        next(e);
    })
// console.log(currname);
//     res.json('测试')
});

//删除管理员
router.post('/deleteadmin',function (req,res,next) {
    // console.log(req.fields);
     for(let key in req.fields){
         AdminModel.deleteAdmin(req.fields[key])
             .then(function (result) {
                 if(!result.result.ok){
                     return res.json('删除失败')
                 }
             })
             .catch(next);
     }
    return res.json('删除成功')
});

module.exports = router;