var express = require('express');
var router = express.Router();
var dbcommand = require('../until/dbCommand.js');
var setting = require('../app.setting.json');
var http = require('http');
var querystring = require('querystring');
var fs = require("fs");

/**
 * 重新讀取Session
 */
router.get('/reLoadSession', function(req, res) {
    if(req.session != undefined){
        res.json({
            "returnData" : req.session.key
        });
    }else{
        res.status(500).send('Session未開啟');
    }
});


// router.get('/login', function (req, res) {
//    // res.send('respond with a resource');

//      // console.log(req.body.email);
//      // console.log(req.body.password);

//      req.session.key = {
//        username : 'Alan',
//        password : 'ret12et3'
//      }
//      req.session.save(function(err){
//       // session saved
//       console.log(err);
//     });

//      res.redirect('/restful/reLoadSession');
//     // res.sendfile('./public/404.html');
// });

/**
 * 登入
 */
router.get('/login', function(req, res) {
    // console.log(req.body);
    // req.session.key = {
    //     username: req.body.email,
    //     password: req.body.password
    // }

    // req.session.save(function(err) {
    //     // session saved
    //     console.log(err);
    // });

    try{        
        // console.log(res.statusCode, req.query);

        // Build the post string from an object
        var post_data = querystring.stringify([
            JSON.stringify({
                crudType : 'Select',
                querymain : 'login',
                queryname : 'SelectAllUserInfo',
                params : {
                    U_ID : req.query.U_ID,
                    U_PW : req.query.U_PW
                }
            }),
            JSON.stringify({
                crudType : 'Select',
                querymain : 'login',
                queryname : 'SelectUserDept',
                params : {
                    UD_ID : req.query.U_ID
                }
            }),
            JSON.stringify({
                crudType : 'Select',
                querymain : 'composeMenu',
                queryname : 'GetUserRight',
                params : {
                    U_ID : req.query.U_ID
                }
            })
        ]);
        
        // An object of options to indicate where to post to
        var post_options = {
            host: '127.0.0.1',
            port: setting.NodeJs.port,
            path: '/restful/crudByTask?'+post_data,
            method: 'GET'
        };

        // Set up the request
        var post_req = http.request(post_options, function (post_res) {

            // console.log("statusCode: ", post_res.statusCode);
            //console.log("headers: ", post_res.headers);
            
            if(post_res.statusCode == 200){
                var content = '';

                post_res.setEncoding('utf8');

                post_res.on('data', function(chunk) {
                    content += chunk;
                });

                post_res.on('end', function() {
                    var _content = JSON.parse(content);
                    // console.log(_content.returnData[0]);
                    // console.log(_content.returnData[1]);

                    if(req.session != undefined){
                        
                        if(_content.returnData[0].length > 0){
                            // 塞入部門資訊
                            _content.returnData[0][0]["DEPTS"] = _content.returnData[1];

                            // 權限
                            var gRight = _content.returnData[2],
                                gRightItem = {
                                    "app.default" : true // 前端預設頁面
                                };

                            // 權限轉換物件
                            for(var igRight in gRight){
                                gRightItem[gRight[igRight].PROG_PATH] = (gRight[igRight].USER_RIGHT == 'true');
                            }

                            // 塞入個人Menu權限
                            _content.returnData[0][0]["GRIGHT"] = gRightItem;

                            // 資料塞入Session
                            req.session.key = _content.returnData[0][0]

                            req.session.save(function(err) {
                                // session saved
                                if(err) console.log(err);
                            });

                        }

                        // res.redirect('/#/dashboard');
                        res.json({
                            "returnData": _content.returnData[0]
                        });

                    }else{
                        res.status(500).send('Session未開啟');
                    }
                });
            }else{
                res.status(500).send('登入失敗');
            }
        });

        post_req.end(); 

    } catch(err) {
        console.log(err);
        res.status(500).send('登入失敗');
    }
});

/**
 * 登出
 */
router.get('/logout', function(req, res) {

    req.session.destroy(function(err) {
        // session saved
        console.log("LogoutError: "+err);
    });

    res.json({
        "returnData": "登出成功"
    });

    // res.redirect('/#/login');
});

/**
 * 版本
 */
router.get('/version', function(req, res) {

    var version = getConfig('../version.json');

    res.json({
        "returnData": version.version
    });

});

module.exports = router;

function readJsonFileSync(filepath, encoding){

    if (typeof (encoding) == 'undefined'){
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

function getConfig(file){

    var filepath = __dirname + '/' + file;
    return readJsonFileSync(filepath);
}
