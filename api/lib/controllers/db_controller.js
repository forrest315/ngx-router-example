'use strict';

var db = require('../db.js');

module.exports.get = function get(req,res){
    var k = req.query.k;
    db.get(k)
        .then(function(v){
            res.send(v);
        })
        .catch(function(){
            res.send('');
        });
};

module.exports.set = function set(req,res){
    var k = req.query.k;
    var v = req.query.v;
    if(!k || !v) {
        k = req.body.k;
        v = req.body.v;
    }
    db.set(k,v)
        .then(function(r){
            res.send(r);
        })
        .catch(function(){
            res.send("ERR");
        });
};

module.exports.del = function del(req,res){
    var k = req.query.k;
    db.del(k)
        .then(function(r){
            res.send(r);
        })
        .catch(function(){
            res.send("ERR");
        });
};

module.exports.keys = function keys(req,res){
    var p = req.query.p;
    if(!p) p = ".*";
    db.keys(p)
        .then(function(r){
            res.send(r);
        })
        .catch(function(){
            res.send("ERR");
        });
};


module.exports.dump = function dump(req,res){
    var p = req.query.p;
    if(!p) p = ".*";
    db.dump(p)
        .then(function(r){
            res.send(r);
        })
        .catch(function(){
            res.send("ERR");
        });
};
