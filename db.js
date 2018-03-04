const MongoClient = require("mongodb").MongoClient;
//连接数据库
function _connectDB(callback) {
    const url = "mongodb://localhost:27017";
    const dbName = "sctec";
    MongoClient.connect(url, function(err, client) {
        const db = client.db(dbName);
        if (err) {
            callback(err, null);
            return;
        }
        callback(err, db, client);
    });
}
//-----增----插入数据
exports.insertOne = function(collectionName, json, callback) {
    _connectDB(function(err, db, client) {
        db.collection(collectionName).insertOne(json, function(err, result) {
            callback(err, result);
            client.close();
        })
    })
}

//-----删-----删除数据
exports.deleteMany = function(collectionName, json, callback) {
    _connectDB(function(err, db, client) {
        //删除
        db.collection(collectionName).deleteMany(json, function(err, results) {
            callback(err, results);
            client.close(); //关闭数据库
        });
    });
};

//-----改-----修改数据
exports.updataMany = function(collectionName, json1, json2, callback) {
    _connectDB(function(err, db, client) {
        db.collection(collectionName).updataMany(json1, json2, function(err, results) {
            callback(err, results);
            client.close();
        })
    })
}

//-----查-----查找数据
exports.find = function(collectionName, json, C, D) {
    var result = [];
    if (arguments.length == 3) {
        var callback = C;
        var skipnumber = 0;
        var limit = 0;
    } else if (arguments.length == 4) {
        //配置：当前页数，每页的数目限制，排序方式
        var args = C;
        var callback = D;
        //每页的数目限制
        var limit = args.pageamount || 0;
        //应该省略的条数
        var skipnumber = args.pageamount * args.page || 0;
        //排序方式
        var sort = args.sort || {};
    } else {
        throw new Error("find函数的参数个数，必须是3个，或者4个。");
        return;
    }
    _connectDB(function(err, db, client) {
        var cursor = db.collection(collectionName).find(json).skip(skipnumber).limit(limit).sort(sort);
        cursor.each(function(err, doc) {
            if (err) {
                callback(err, null);
                db.close();
                return;
            }
            if (doc != null) {
                result.push(doc);
            } else {
                callback(null, result);
                client.close();
            }
        });
    });
}

//获取总数
exports.getAllCount = function(collectionName, callback) {
    _connectDB(function(err, db, client) {
        //then()方法是异步执行就是当.then() 前的方法执行完后再执行then() 内部的程序
        db.collection(collectionName).count({}).then(function(count) {
            callback(count);
            client.close();
        });
    })
}