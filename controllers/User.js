'use strict';

var auth = require("../auth");

const bcrypt = require('bcryptjs');

var utils = require('../utils/writer.js');
var User = require('../service/UserService');

module.exports.profileDetails = function profileDetails(req, res, next) {
    var token = req.headers.api_key;
    var tokenString = token.split(" ")[1];
    var user_id = auth.getUserIdFromToken(tokenString);
    User.profileDetails(user_id)
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                utils.writeJson(res, response[0]);
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
    User.resultCreateID()
        .then(function (response) {
            var result_id = response.result_id + 1;
            User.addResult(result_id, id1, id2, points1, points2)
                .then(function (response) {
                    User.checkResult(result_id)
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
};

module.exports.userSignUp = function userSignUp(req, res, next) {
    var name = req.swagger.params['name'].value;
    var surname = req.swagger.params['surname'].value;
    var password = req.swagger.params['password'].value;
    var username = req.swagger.params['username'].value;
    var email = req.swagger.params['email'].value;
    var birthday = req.swagger.params['birthday'].value;
    User.userCreateID()
        .then(function (response) {
            var user_id = response.user_id + 1;
//      console.log("then 7");
            User.insertUser(user_id, name, surname, password, username, email, birthday)
                .then(function (response) {
//              console.log("then 6");
                    User.getHash(email)
                        .then(function (response) {
//                      console.log("then 5");
//                      console.log(response);
                            var hash = response.password;
                            bcrypt.compare(password, hash)
                                .then(function (result) {
                                    if (result == true) {
//                                  console.log("then 4 (bcrypt.compare)");
//                                  console.log(response);
                                        User.checkCredentials(email, hash)
                                            .then(function (response) {
//                                          console.log("then3");
//                                          console.log(response);
                                                if (Object.keys(response).length > 0) {
//                                              console.log("TRUE 2");
                                                    res.statusCode = 201;
                                                    res.end("Account created successfully");
                                                } else {
//                                              console.log("false 2");
                                                    var err = new Error('Error 400: account not created');
                                                    err['code'] = 400400;
                                                    throw err;
                                                }
                                            })
                                            .catch(function (response) {
//                                          console.log("catch 3");
                                                if (response && response.code && response.code === 400400) {
                                                    utils.writeJson(res, response.message, 400);
                                                } else {
                                                    utils.writeJson(res, response.toString(), 400);
                                                }
                                            })
                                    } else {
                                        var err = new Error('Error 401: credentials not valid');
                                        err['code'] = 401401;
                                        throw err;
                                    }
                                })
                                .catch(function (response) {
//                              console.log("catch");
                                    if (response && response.code && response.code === 401401) {
                                        utils.writeJson(res, response.message, 401);
                                    } else {
                                        utils.writeJson(res, response.toString(), 400);
                                    }
                                });
                        })
                        .catch(function (response) {
//                      console.log("catch 5");
                            utils.writeJson(res, response.toString(), 400);
                        })
                })
                .catch(function (response) {
//              console.log("catch 6");
                    utils.writeJson(res, response, 400);
                })
        })
        .catch(function (response) {
//        console.log("catch 7");
            utils.writeJson(res, response, 400);
        });
};

module.exports.userSignIn = function userSignIn(req, res, next) {
    var email = req.swagger.params['email'].value;
    var password = req.swagger.params['password'].value;
    /*
    //to Try
        var tokenString = auth.issueToken("1");
        var response2 = {token: tokenString};
        utils.writeJson(res, response2);
    //
    */
    var error = {};
    User.getHash(email)
        .then(function (response) {
            if (response && Object.keys(response).length > 0) {
//                console.log("then 5");
//                console.log(response);
                var hash = response.password;
                bcrypt.compare(password, hash)
                    .then(function (result) {
//                        console.log("then 4 bcrypt begin");
                        if (result == true) {
//                            console.log("then 4 bcrypt true");
//                            console.log(response);
                            User.checkCredentials(email, hash)
                                .then(function (response) {
//                                    console.log(response);
                                    if (response && Object.keys(response).length > 0) {
                                        var tokenString = auth.issueToken(response[0].user_id);
                                        var response2 = {token: tokenString};
                                        utils.writeJson(res, response2);
                                    } else {
                                        var err = new Error('Error 401: credentials not valid');
                                        err['code'] = 401401;
                                        throw err;
                                    }
                                })
                                .catch(function (response) {
                                    if (response && response.code && response.code === 401401) {
                                        utils.writeJson(res, response.message, 401);
                                    } else {
                                        utils.writeJson(res, response, 400);
                                    }
                                })
                        } else {
                            var err = new Error('Error 401: credentials not valid');
                            err['code'] = 401401;
                            throw err;
                        }
//                        console.log("then 4 bcrypt ending");
                    })
                    .catch(function (response) {
//                        console.log("catch 4");
                        if (response && response.code && response.code === 401401) {
                            utils.writeJson(res, response.message, 401);
                        } else {
                            utils.writeJson(res, response.toString(), 400);
                        }
                    });
            } else {
                var err = new Error('Error 401: credentials not valid');
                err['code'] = 401401;
                throw err;
            }
        })
        .catch(function (response) {
//            console.log("catch 5");
            if (response && response.code && response.code === 401401) {
                utils.writeJson(res, response.message, 401);
            } else {
                utils.writeJson(res, response.toString(), 400);
            }
        });
};

