const checkLogin =  require('../middlewares/check').checkLogin;
const Admin = require('../models/admins');
const Root = require('../models/roots');
const fs =require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/',checkLogin,function (req,res,next) {
    if(req.session.root){
        return res.render('userinfo',{
            name:req.session.root.name,
            gender:req.session.root.gender,
            avatar:req.session.root.avatar
        });
    }
    res.render('userinfo',{
        name:req.session.admin.name,
        avatar:req.session.admin.avatar,
        gender:req.session.admin.gender,
    });
});

router.post('/editinfo',checkLogin,function (req,res,next) {
    if(req.session.root){
        let curroot=req.session.root.name;
        let avatar=req.files.avatar.path.split(path.sep).pop();
        let name=req.fields.name;
        let gender = req.fields.gender;
        let oldavatar_path = req.session.root.avatar;
        // console.log(req.files.avatar)
        if(req.files.avatar.size===0){
            avatar=oldavatar_path;
        }
        if(gender === "男"){
            gender = 'm'
        }else if(gender === '女'){
            gender = 'f'
        }else {
            gender = 'x'
        }
        let newRoot = {
            name:name,
            avatar:avatar,
            gender:gender
        };

        Root.updateRootInfo(curroot,{
            name:name,
            gender:gender,
            avatar:avatar
        })
            .then(function (root) {
                if(root){
                    req.session.root = newRoot;
                    //异步删除原来保存的头像
                    // if(req.files.avatar.size!==0){
                    //     fs.unlink('C:\\Users\\实验室\\Desktop\\blog\\nodeBlog\\public\\img\\'+oldavatar_path,function (error) {
                    //         if(error){
                    //             console.log("本地删除失败");
                    //         }
                    //     });
                    // }
                    // console.log(oldavatar_path)
                    return res.json("修改成功！");
                }
                return res.json('修改失败，请重试！');
            })
            .catch(next);

    }else{
        let curadmin=req.session.admin.name;
        let avatar=req.files.avatar.path.split(path.sep).pop();
        let name=req.fields.name;
        let gender = req.fields.gender;
        let oldavatar_path = req.session.admin.avatar;
        // console.log(req.files.avatar)
        if(req.files.avatar.size===0){
            avatar=oldavatar_path;
        }
        if(gender === "男"){
            gender = 'm'
        }else if(gender === '女'){
            gender = 'f'
        }else {
            gender = 'x'
        }

        let newAdmin = {
            name:name,
            avatar:avatar,
            gender:gender
        };
        Admin.updateAdminInfo(curadmin,{
            name:name,
            gender:gender,
            avatar:avatar
        })
            .then(function (admin) {
                if(admin){
                    req.session.admin = newAdmin;
                    //异步删除原来保存的头像
                    // if(req.files.avatar.size!==0){
                    //     fs.unlink('C:\\Users\\实验室\\Desktop\\blog\\nodeBlog\\public\\img\\'+oldavatar_path,function (error) {
                    //         if(error){
                    //             console.log("本地删除失败");
                    //         }
                    //     });
                    // }
                    // console.log(oldavatar_path)
                    return res.json("修改成功！");
                }
                return res.json('修改失败，请重试！');
            })
            .catch(function (e) {
                //注册失败，异步删除刚保存的头像
                fs.unlink(req.files.avatar.path,function (err) {

                });
                if(e.message.match('duplicate key')){
                    //已定义用户名唯一，duplicate -->重复
                    //用户名重复了
                   return res.json('用户名已被占用');
                }

                next(e);
            })
    }

});

module.exports=router;
