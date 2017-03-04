'use strict';
var co = require('co');
var Mapper = require('../models/mapper.js');

var conf = function(req, res) {
    return co(function*(){
        for(let cn in req.query) {
            var cv = req.query[cn];
            yield Mapper.setConf(cn, req.query[cn]);
        }
        res.send('OK');
    }).catch(function(){
        res.send('ERR');
    });
};

var list = function(req, res) {
    Mapper.list('.*')
        .then(function(l) {
        res.send(JSON.stringify(l, null, "  "));
        })
        .catch(function(){
            res.send([]);
        });
};

var addOne = function(req, res) {
    var pair = {
        pattern: req.query.pattern,
        target: req.query.target
    };
    req.body = [pair];
    add(req, res);
};

var add = function(req, res) {
    if (!req.body.length) {
        return res.send("[]");
    }
    return co(function*() {
        var pairs = req.body;
        for (let pair of pairs) {
            var pattern = String(pair.pattern);
            var target = String(pair.target);
            // re: (host|ip)[:port]
            var host = /^(([0-9a-zA-Z][0-9a-zA-Z.-]*\.[a-zA-Z]+)|([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+))(:[0-9]+)*$/g;
            if (pattern.indexOf('/') !== 0 || !target.match(host)) {
                pair.status = "BAD";
            } else {
                try {
                    var mp = new Mapper(pattern, target);
                    yield mp.save();
                    pair.status = "OK";
                } catch (err) {
                    pair.status = "ERR";
                }
            }
        }
        res.send(JSON.stringify(pairs, null, '  '));
    });
};

var del = function(req, res){
    var p = req.query.pattern;
    if(!p) return res.send("ERR");
    return Mapper.del(p)
        .then(function(){
            res.send("OK");
        })
        .catch(function(){
            res.send("ERR");
        });
};

var loadOne = function(req, res) {
    req.body = {};
    req.body[req.query.pattern] = req.query.target;
    load(req, res);
};

var load = function(req, res) {
    return co(function*() {
        var finished = [];
        for (let k in req.body) {
            var pattern = String(k);
            var target = String(req.body[k]);
            // re: (host|ip)[:port]
            var host = /(([0-9a-zA-Z][0-9a-zA-Z.-]*\.[a-zA-Z]+)|([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+))(:[0-9]+)*/;
            if (pattern.indexOf('/') !== 0 || target.replace(host, '') !== '') {
                finished.push({
                    pattern: pattern,
                    target: target,
                    status: "BAD"
                });
            } else {
                try {
                    var mp = new Mapper(pattern, target);
                    yield mp.save();
                    finished.push({
                        pattern: pattern,
                        target: target,
                        status: "OK"
                    });
                } catch (err) {
                    finished.push({
                        pattern: pattern,
                        target: target,
                        status: "FAIL"
                    });
                }
            }
        }
        res.send(JSON.stringify(finished, null, '  '));
    });
};

module.exports = {
    conf,
    list,
    addOne,
    add,
    del,
    loadOne,
    load
};
