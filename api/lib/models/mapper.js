'use strict';

var config = require('../config.js'),
    prefix = config.prefix,
    db = require('../db.js');

function Mapper(pattern, target) {
    this.pattern = pattern;
    this.target = target;
}

module.exports = Mapper;

Mapper.prototype.save = function() {
    var k = prefix + ":ptn:" + this.pattern;
    var v = this.target;

    return db.set(k,v);
};

Mapper.get = function(p) {
    var k = prefix + ":ptn:" + p;
    return db.get(k);
};

Mapper.del = function(p) {
    var k = prefix + ":ptn:" + p;
    return db.del(k);
};

Mapper.list = function(p) {
    return new Promise(function(resole,reject){
        db.dump(prefix + ":ptn:" + p)
            .then(function(a){
                var r = [];
                for(let i of a){
                    r.push({
                        pattern: i.key,
                        target: i.value
                    });
                }
                resole(r);
            })
            .catch(function(err){
                reject(err);
            });
    });
};

Mapper.setConf = function(cn,cv) {
    var ck = prefix + ":conf:" + cn;
    return db.set(ck, cv);
};

Mapper.getConf = function(p) {
    return new Promise(function(resole,reject){
        db.dump(prefix + ":conf:" + p)
            .then(function(a){
                var r = [];
                for(let i of a){
                    r.push({
                        pattern: i.key,
                        target: i.value
                    });
                }
                resole(r);
            })
            .catch(function(err){
                reject(err);
            });
    });
};
