'use strict';

var auth = require("../auth");

var utils = require('../utils/writer.js');
var ShoppingCart = require('../service/ShoppingCartService');

module.exports.shoppingCartList = function shoppingCartList(req, res, next) {
    var token = req.headers.api_key;
    var tokenString = token.split(" ")[1];
    var user_id = auth.getUserIdFromToken(tokenString);
    ShoppingCart.shoppingCartList(user_id)
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                utils.writeJson(res, response);
            } else {
                var err = new Error('Error 204: no item in shopping cart');
                err['code'] = 204204;
                throw err;
            }
        })
        .catch(function (response) {
            if (response && response.code && response.code === 204204) {
                utils.writeJson(res, response.message, 204);
            } else {
                utils.writeJson(res, response, 400);
            }
        });
};

module.exports.shoppingCartAdd = function shoppingCartAdd(req, res, next) {
    var shopping_cart = {};
    shopping_cart.isbn = req.body.isbn;
    shopping_cart.quantity = req.body.quantity;
    var token = req.headers.api_key;
    var tokenString = token.split(" ")[1];
    var user_id = auth.getUserIdFromToken(tokenString);
    shopping_cart.user_id = user_id;
    var old_quantity = 0;
    ShoppingCart.checkShoppingCart(user_id, shopping_cart.isbn)
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                old_quantity = response[0].quantity;
            }
            ShoppingCart.shoppingCartAdd(shopping_cart, old_quantity) //add check sulla somma totale dai return di questa
                .then(function (response) {
                    ShoppingCart.checkShoppingCart(user_id, shopping_cart.isbn)
                        .then(function (response) {
                            if (Object.keys(response).length > 0 && response[0].quantity == shopping_cart.quantity + old_quantity) {
                                res.statusCode = 201;
                                res.end("Item added successfully");
                            } else {
                                if (Object.keys(response).length > 0) {
                                    var err = new Error('Error 400: quantity not coherent');
                                    err['code'] = 400400;
                                    throw err;
                                } else {
                                    var err = new Error('Error 400: item not placed in the shopping cart');
                                    err['code'] = 400400;
                                    throw err;
                                }
                            }
                        })
                        .catch(function (response) {
                            if (response && response.code && response.code === 400400) {
                                utils.writeJson(res, response.message, 400);
                            } else {
                                utils.writeJson(res, response, 400);
                            }
                        })
                })
                .catch(function (response) {
                    utils.writeJson(res, response, 400);
                })
        })
        .catch(function (response) {
            utils.writeJson(res, response, 400);
        })
};

module.exports.shoppingCartRemove = function shoppingCartRemove(req, res, next) {
    var shopping_cart = {};
    shopping_cart.isbn = req.body.isbn;
    shopping_cart.quantity = req.body.quantity;
    var token = req.headers.api_key;
    var tokenString = token.split(" ")[1];
    var user_id = auth.getUserIdFromToken(tokenString);
    shopping_cart.user_id = user_id;
    ShoppingCart.checkShoppingCart(shopping_cart.user_id, shopping_cart.isbn)
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                ShoppingCart.shoppingCartRemove(shopping_cart)
                    .then(function (response) {
                        if (response > 0) {
                            ShoppingCart.checkShoppingCart(user_id, shopping_cart.isbn)
                                .then(function (response) {
                                    if (Object.keys(response).length > 0) {
                                        var err = new Error('Error 400: item not removed from the shopping cart');
                                        err['code'] = 400400;
                                        throw err;
                                    } else {
                                        res.statusCode = 201;
                                        res.end("Item removed successfully");
                                    }
                                })
                                .catch(function (response) {
                                    if (response && response.code && response.code === 400400) {
                                        utils.writeJson(res, response.message, 400);
                                    } else {
                                        utils.writeJson(res, response, 400);
                                    }
                                })
                        } else {
                            var err = new Error('Error 400: no item removed from the shopping cart');
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
            } else {
                var err = new Error('Error 400: item to remove not present in the shopping cart');
                err['code'] = 400401;
                throw err;
            }

        })
        .catch(function (response) {
            if (response && response.code && response.code === 400401) {
                utils.writeJson(res, response.message, 400);
            } else {
                utils.writeJson(res, response.toString(), 400);
            }
        })
};

module.exports.searchCart = function searchCart(req, res, next) {
    var token = req.headers.api_key;
    var tokenString = token.split(" ")[1];
    var user_id = auth.getUserIdFromToken(tokenString);
    var search = req.swagger.params['search'].value;
    if (search) {
        search = search.toLowerCase();
    }
    ShoppingCart.searchCart(search, user_id)
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                utils.writeJson(res, response);
            } else {
                var err = new Error('Error 204: no item for these search words');
                err['code'] = 204204;
                throw err;
            }
        })
        .catch(function (response) {
            if (response && response.code && response.code === 204204) {
                utils.writeJson(res, response.message, 204);
            } else {
                utils.writeJson(res, response, 400);
            }
        });
};

