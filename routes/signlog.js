const LogModel = require('../models/logs');
const express = require('express');
const router = express.Router();
const checkLogin =require('../middlewares/check').checkLogin;

router.get('/',checkLogin,function (req,res,next) {
    res.render('signlog')
});
router.get('/logslist',checkLogin,function (req,res,next) {
    // console.log(typeof req.query.pageName);
    let pageName =parseInt(req.query.pageName) ;
    let currPage = parseInt(req.query.currPage);
    //获取日志
    LogModel.getAllLogs()
        .then(function (logs) {
            let start=0;
            let end=0;
             start = (currPage-1)*pageName;
             end = start+pageName;
            let tmp = logs.slice(start,end);
            let logslist ={
                code:0,
                msg:"",
                count:logs.length,
                data:tmp
            };
            res.json(logslist);
        })
});
module.exports=router;