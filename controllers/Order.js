'use strict';

var auth = require("../auth");

var utils = require('../utils/writer.js');
var Order = require('../service/OrderService');
var User = require('../service/UserService');

module.exports.ordersList = function ordersList (req, res, next) {
    var token = req.headers.api_key;
    var tokenString = token.split(" ")[1];
    var user_id = auth.getUserIdFromToken(tokenString);
    Order.ordersList(user_id)
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                utils.writeJson(res, response);
            } else {
                var err = new Error('Error 204: no orders');
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

module.exports.orderPlace = function orderPlace (req, res, next) {
  var order = {};
  order.order_details = req.body.order_details;
  order.payment_method = req.body.payment_method;
  order.address = req.body.address;
  var token = req.headers.api_key;
  var tokenString = token.split(" ")[1];
  var user_id = auth.getUserIdFromToken(tokenString);
  order.user_id = user_id;
  Order.orderCreateID()
    .then(function (response) {
        var order_number = response.order_number + 1;
        order.order_number = order_number;
        var now = new Date();
        var date = now.toISOString();
        order.date = date;
        now.setDate(now.getDate() + 7);
        order.shipping_date = now.toISOString();
        order.tracking_number = order_number;
        order.status = "pending";
        User.getAccountCredit(order.user_id)
            .then(function(response){
                var account_credit = response.account_credit;
                order.old_account_credit = account_credit;
                Order.insertOrder(order)
                    .then(function(response){
                        Order.checkOrder(order_number)
                            .then(function (response) {
                                if (Object.keys(response).length > 0) {
                                    res.statusCode = 201;
                                    res.end("Order placed successfully");
                                } else {
                                    var err = new Error('Error 400: Order not placed');
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
                utils.writeJson(res, response.toString(), 400);
            })
    })
    .catch(function (response) {
        utils.writeJson(res, response.toString(), 400);
    });
};

module.exports.searchOrder = function searchOrder (req, res, next) {
    var token = req.headers.api_key;
    var tokenString = token.split(" ")[1];
    var user_id = auth.getUserIdFromToken(tokenString);
    var search = req.swagger.params['search'].value;
    if(search){
        search = search.toLowerCase();
    }
    Order.searchOrder(search,user_id)
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                utils.writeJson(res, response);
            } else {
                var err = new Error('Error 204: no order for these search words');
                err['code'] = 204204;
                throw err;
            }
        })
        .catch(function (response) {
            if (response && response.code && response.code === 204204) {
                utils.writeJson(res, response.message, 204);
            } else {
                utils.writeJson(res, response.toString(), 400);
            }
        });
};


