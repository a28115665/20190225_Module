var express = require('express');
var router = express.Router();
var dbCommand = require('../until/dbCommand.js');
var dbCommandByTask = require('../until/dbCommandByTask.js');
var async = require('async');
var logger = require('../until/log4js.js').logger('restful');
var winston = require('winston');
var setting = require('../app.setting.json');
require('../until/winstonByMssql.js');

winston.add(winston.transports.mssql, {
    connectionString: setting.MSSQL,
    table: "SYS_DBLOGS"
});
winston.remove(winston.transports.Console);

/**
 * Restful 查詢
 */
router.get('/crud', function(req, res) {

    let _id = FindID(req.session);
    
    dbCommand.SelectMethod(req.query["querymain"], req.query["queryname"], req.query["params"], function(err, recordset, sql) {
        
        if (err) {
            if(_id != null){
                winston.log('error', JSON.stringify({
                    User : _id,
                    Msg : JSON.stringify(err),
                    Sql : sql,
                    IP: req.ip
                }));
            }
            console.error("查詢失敗錯誤訊息:", err);

            // Do something with your error...
            // logger.error('查詢失敗', req.ip, __line+'行', err, sql);
            res.status(500).send('查詢失敗');
        } else {
            if(_id != null){
                // 依據檔名寫log
                switch(req.query["querymain"]){
                    case 'job001':
                    case 'job002':
                    case 'job003':
                        winston.log('info', JSON.stringify({
                            User : _id,
                            Msg : '',
                            Sql : sql,
                            IP: req.ip
                        }));
                        break;
                }
            }

            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
            .status(200)
            .json({
                "returnData": recordset
            });
        }
    })
    
    // connection.close();
    
    // session檢核
    // if(req.session.key === undefined){}
    // if (Object.keys(req.query).length === 0) {
    //     res.end();
    // } else {
    //     res.json({
    //         "returnData": req.query
    //     });
    // }
});

/**
 * Restful 新增
 */
router.post('/crud', function(req, res) {

    let _id = FindID(req.session);

    // console.log("POST: ", req.query);
    dbCommand.InsertMethod(req.query["insertname"], req.query["table"], req.query["params"], function(err, affected, sql) {
        if (err) {
            if(_id != null){
                winston.log('error', JSON.stringify({
                    User : _id,
                    Msg : JSON.stringify(err),
                    Sql : sql,
                    IP: req.ip
                }));
            }
            console.error("新增失敗錯誤訊息:", err);

            // console.log(err);
            // Do something with your error...
            res.status(500).send('新增失敗');
        } else {
            if(_id != null){
                winston.log('info', JSON.stringify({
                    User : _id,
                    Msg : '',
                    Sql : sql,
                    IP: req.ip
                }));
            }

            res.json({
                "returnData": affected
            });
        }
    })
    
    // session檢核
    // if(req.session.key === undefined){}
    // if (Object.keys(req.query).length === 0) {
    //     res.end();
    // } else {
    //     res.json({
    //         "returnData": req.query
    //     });
    // }
});

/**
 * Restful 更新
 */
router.put('/crud', function(req, res) {

    let _id = FindID(req.session);

    // console.log("PUT: ", req.query);
    dbCommand.UpdateMethod(req.query["updatename"], req.query["table"], req.query["params"], req.query["condition"], function(err, affected, sql) {
        if (err) {
            if(_id != null){
                winston.log('error', JSON.stringify({
                    User : _id,
                    Msg : JSON.stringify(err),
                    Sql : sql,
                    IP: req.ip
                }));
            }
            console.error("更新失敗錯誤訊息:", err);

            // console.log(err);
            // Do something with your error...
            res.status(500).send('更新失敗');
        } else {
            if(_id != null){
                winston.log('info', JSON.stringify({
                    User : _id,
                    Msg : '',
                    Sql : sql,
                    IP: req.ip
                }));
            }

            res.json({
                "returnData": affected
            });
        }
    })
    
    // session檢核
    // if(req.session.key === undefined){}
    // if (Object.keys(req.query).length === 0) {
    //     res.end();
    // } else {
    //     res.json({
    //         "returnData": req.query
    //     });
    // }
});

/**
 * Restful 插入
 */
router.patch('/crud', function(req, res) {

    let _id = FindID(req.session);

    // console.log("PATCH: ", req.query);
    dbCommand.UpsertMethod(req.query["upsertname"], req.query["table"], req.query["params"], req.query["condition"], function(err, affected, sql) {
        if (err) {
            if(_id != null){
                winston.log('error', JSON.stringify({
                    User : _id,
                    Msg : JSON.stringify(err),
                    Sql : sql,
                    IP: req.ip
                }));
            }
            console.error("插入失敗錯誤訊息:", err);

            // console.log(err);
            // Do something with your error...
            res.status(500).send('插入失敗');
        } else {
            if(_id != null){
                winston.log('info', JSON.stringify({
                    User : _id,
                    Msg : '',
                    Sql : sql,
                    IP: req.ip
                }));
            }

            res.json({
                "returnData": affected
            });
        }
    })
    
    // session檢核
    // if(req.session.key === undefined){}
    // if (Object.keys(req.query).length === 0) {
    //     res.end();
    // } else {
    //     res.json({
    //         "returnData": req.query
    //     });
    // }
});

/**
 * Restful 刪除
 */
router.delete('/crud', function(req, res) {

    let _id = FindID(req.session);

    // console.log("DELETE: ", req.query);
    dbCommand.DeleteMethod(req.query["deletename"], req.query["table"], req.query["params"], function(err, affected, sql) {
        if (err) {
            if(_id != null){
                winston.log('error', JSON.stringify({
                    User : _id,
                    Msg : JSON.stringify(err),
                    Sql : sql,
                    IP: req.ip
                }));
            }
            console.error("刪除失敗錯誤訊息:", err);

            // console.log(err);
            // Do something with your error...
            res.status(500).send('刪除失敗');
        } else {
            if(_id != null){
                winston.log('info', JSON.stringify({
                    User : _id,
                    Msg : '',
                    Sql : sql,
                    IP: req.ip
                }));
            }

            res.json({
                "returnData": affected
            });
        }
    })
    
    // session檢核
    // if(req.session.key === undefined){}
    // if (Object.keys(req.query).length === 0) {
    //     res.end();
    // } else {
    //     res.json({
    //         "returnData": req.query
    //     });
    // }
});


/**
 * Restful By Task 查詢
 * 參考 http://qiita.com/mima_ita/items/dc867fa4f316d85533b1
 */
router.get('/crudByTask', function(req, res) {

    let _id = FindID(req.session);
    
    // console.log(req.query);

    var tasks = [];
    tasks.push(dbCommandByTask.Connect);
    tasks.push(dbCommandByTask.TransactionBegin);

    for(var i in req.query){
        var _task = JSON.parse(req.query[i]);
        switch(_task.crudType){
            case "Select":
                tasks.push(async.apply(dbCommandByTask.SelectRequestWithTransaction, _task));
                break;
            case "Insert":
                tasks.push(async.apply(dbCommandByTask.InsertRequestWithTransaction, _task));
                break;
            case "Update":
                tasks.push(async.apply(dbCommandByTask.UpdateRequestWithTransaction, _task));
                break;
            case "Delete":
                tasks.push(async.apply(dbCommandByTask.DeleteRequestWithTransaction, _task));
                break;
            case "Upsert":
                tasks.push(async.apply(dbCommandByTask.UpsertRequestWithTransaction, _task));
                break;
            case "Copy":
                tasks.push(async.apply(dbCommandByTask.CopyRequestWithTransaction, _task));
                break;
            default:
                break;
        }
    }

    tasks.push(dbCommandByTask.TransactionCommit);
    // tasks.push(dbCommandByTask.DisConnect);
    // console.log(tasks);

    async.waterfall(tasks, function (err, args) {
        if (err) {
            // 如果連線失敗就不做Rollback
            if(Object.keys(args).length !== 0){
                dbCommandByTask.TransactionRollback(args, function (err, result){
                    
                });
            }

            if(_id != null){
                for(var i in args.statement){
                    winston.log('error', JSON.stringify({
                        User : _id,
                        Msg : JSON.stringify(err),
                        Sql : args.statement[i],
                        IP: req.ip
                    }));
                }
                // console.log(args.statement);
            }
            console.error("任務失敗錯誤訊息:", err);

            res.status(500).send('任務失敗');
            // process.exit();
        }else{

            if(_id != null){
                for(var i in args.statement){
                    winston.log('info', JSON.stringify({
                        User : _id,
                        Msg : '',
                        Sql : args.statement[i],
                        IP: req.ip
                    }));
                }
                // console.log(args.statement);
            }
            // console.log("args:", args);
            res.json({
                "returnData": args.result
            });
        }
    });

});

function FindID(pSession){
    let _id = null;

    if(pSession['key'] != undefined){
        _id = pSession['key'].U_ID
    }

    return _id;
}

module.exports = router;
