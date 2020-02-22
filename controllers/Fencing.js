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

module.exports.insertResult = function insertResult(req, res, next) {
    var id1 = req.body.result.id1;
    var id2 = req.body.result.id2;
    var points1 = req.body.result.points1;
    var points2 = req.body.result.points2;
    var token = req.headers.api_key;
    var tokenString = token.split(" ")[1];
    var user_id = auth.getUserIdFromToken(tokenString);
    if (id1 != id2){
        if (points1 != points2) {
            Fencing.resultCreateID()
                .then(function (response) {
                    var result_id = response.result_id + 1;
                    Fencing.addResult(result_id, id1, id2, points1, points2)
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
            utils.writeJson(res, 'No winner!', 400);
        }
    } else {
        utils.writeJson(res, 'Same fencer!', 400);
    }
};

