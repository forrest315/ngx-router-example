'use strict';

var level = require('level');

var config = require('./config.js');
var db = level(config.db);

module.exports.get = function(k) {
    return new Promise(function(resole, reject){
        db.get(k, function(err, v){
            if(err) reject(err);
            else resole(v);
        });
    });
};

module.exports.set = function(k,v) {
    return new Promise(function(resole, reject) {
        db.put(k, v, function (err) {
            if(err) {
                reject(err);
            } else {
                resole("OK");
            }
        });
    });
};

module.exports.del = function(k) {
    return new Promise(function(resole, reject){
        db.del(k, function(err){
            if(err) reject(err);
            else resole("OK");
        });
    });
};

module.exports.dump = function(p) {
    var ptn = new RegExp('^' + p + '$', 'g');
    return new Promise(function(resole, reject) {
        var r = [];
        db.createReadStream()
            .on('data', function (data) {
                if(data.key && data.key.match(ptn)) r.push(data);
            })
            .on('error', function (err) {
                reject(err);
            })
            .on('end', function () {
                resole(r);
            });
    });
};

module.exports.keys = function(p) {
    var ptn = new RegExp('^' + p + '$', 'g');
    return new Promise(function(resole, reject) {
        var r = [];
        db.createKeyStream()
            .on('data', function (data) {
                if(data && data.match(ptn)) r.push(data);
            })
            .on('error', function (err) {
                reject(err);
            })
            .on('end', function () {
                resole(r);
            });
    });
};

module.exports.values = function() {
    return new Promise(function(resole, reject) {
        var r = [];
        db.createValueStream()
            .on('data', function (data) {
                r.push(data);
            })
            .on('error', function (err) {
                reject(err);
            })
            .on('end', function () {
                resole(r);
            });
    });
};
