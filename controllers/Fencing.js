'use strict';

var auth = require("../auth");

const bcrypt = require('bcryptjs');

var utils = require('../utils/writer.js');
var Fencing = require('../service/FencingService');

module.exports.getFencers = function getFencers(req, res, next) {
    var token = req.headers.api_key;
    var tokenString = token.split(" ")[1];
    var user_id = auth.getUserIdFromToken(tokenString);
    Fencing.getFencers()
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                utils.writeJson(res, response);
            } else {
                var err = new Error('Error 401: token not valid');
                err['code'] = 401401;
                throw err;
            }
        })
        .catch(function (response) {
            if (response && response.code && response.code === 401401) {
                utils.writeJson(res, response.message, 401);
            } else {
                utils.writeJson(res, response.toString(), 400);
            }
        });
};

module.exports.getRanking = function getRanking(req, res, next) {
    var token = req.headers.api_key;
    var tokenString = token.split(" ")[1];
    var user_id = auth.getUserIdFromToken(tokenString);
    var now = new Date();
    var ending_date = now.toISOString();
    now.setDate(now.getDate() - 120);
    var initial_date = now.toISOString();
    Fencing.getResults(initial_date, ending_date)
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                var data = {};
                response.forEach(result => {
                    var id1 = result.id1;
                    var points1 = result.points1;
                    var id2 = result.id2;
                    var points2 = result.points2;
                    if(!data.hasOwnProperty(id1)){
                        data[id1] = {
                            name: result.name1,
                            surname: result.surname1,
                            nickname: result.nickname1,
                            percentage: 0,
                            lcb: 0,
                            win: 0,
                            lose: 0,
                            difference: 0,
                            points_for: 0,
                            points_against: 0
                        };
                    }
                    if(!data.hasOwnProperty(id2)){
                        data[id2] = {
                            name: result.name2,
                            surname: result.surname2,
                            nickname: result.nickname2,
                            percentage: 0,
                            lcb: 0,
                            win: 0,
                            lose: 0,
                            difference: 0,
                            points_for: 0,
                            points_against: 0
                        };
                    }
                    if(points1 > points2){
                        data[id1].win++;
                        data[id2].lose++;
                    } else {
                        data[id1].lose++;
                        data[id2].win++;
                    }
                    data[id1].points_for += points1;
                    data[id1].points_against += points2;
                    data[id2].points_for += points2;
                    data[id2].points_against += points1;
                    });
                var ranking = [];
                Object.keys(data).forEach(function(key) {
                    var fencer = data[key];
                    fencer.percentage = fencer.win/(fencer.win+fencer.lose);
                    fencer.difference = fencer.points_for-fencer.points_against;
                    ranking.push(fencer);
                });
                ranking.sort(compare);
                utils.writeJson(res, ranking);
            } else {
                var err = new Error('Error 401: token not valid');
                err['code'] = 401401;
                throw err;
            }
        })
        .catch(function (response) {
            if (response && response.code && response.code === 401401) {
                utils.writeJson(res, response.message, 401);
            } else {
                utils.writeJson(res, response.toString(), 400);
            }
        });
};

function compare(a, b) {
    if (a.percentage > b.percentage) return -1;
    if (b.percentage > a.percentage) return 1;
    if (a.difference > b.difference) return -1;
    if (b.difference > a.difference) return 1;
    if (a.points_for > b.points_for) return -1;
    if (b.points_for > a.points_for) return 1;
    return 0;
}

module.exports.insertResult = function insertResult(req, res, next) {
    var id1 = req.body.result.id1;
    var id2 = req.body.result.id2;
    var points1 = req.body.result.points1;
    var points2 = req.body.result.points2;
    var now = new Date();
    var date = now.toISOString();
    var token = req.headers.api_key;
    var tokenString = token.split(" ")[1];
    var user_id = auth.getUserIdFromToken(tokenString);
    if (id1 !== id2){
        if (points1 !== points2) {
            if (points1 >= 0 && points2 >= 0) {
                Fencing.resultCreateID()
                    .then(function (response) {
                        var result_id = response.result_id + 1;
                        Fencing.addResult(result_id, id1, id2, points1, points2, date)
                            .then(function (response) {
                                Fencing.checkResult(result_id)
                                    .then(function (response) {
                                        if (Object.keys(response).length > 0) {
                                            res.statusCode = 201;
                                            res.end("Result added successfully");
                                        } else {
                                            var err = new Error('Error 400: result not added');
                                            err['code'] = 400400;
                                            throw err;
                                        }
                                    })
                                    .catch(function (response) {
                                        if (response && response.code && response.code === 400400) {
                                            utils.writeJson(res, response.message, 400);
                                        } else {
                                            utils.writeJson(res, response.toString(), 400);
                                        }
                                    })
                            })
                            .catch(function (response) {
                                utils.writeJson(res, response.toString(), 400);
                            })
                    })
                    .catch(function (response) {
                        utils.writeJson(res, response, 400);
                    });
            } else {
                res.statusCode = 403;
                res.end("Negative points");
            }
        } else {
            res.statusCode = 402;
            res.end("No winner!");
        }
    } else {
        res.statusCode = 401;
        res.end("Same fencer!");
    }
};

