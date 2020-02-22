'use strict';

var auth = require("../auth");
let sqlDB;

const bcrypt = require('bcryptjs');
const saltRounds = 10;

exports.fencingDBConnection = function (database) {
    sqlDB = database;
}


/**
 * Retrieves profile information for the current user
 * The data is retrieved for the user in the current session
 *
 * returns UserDetails
 **/
exports.getFencers = function () {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_fencer').select('fencer_id', 'name', 'surname', 'nickname', 'year'));
    });
}


/**
 * Add gift card value to current user credit
 * The account credit of the logged user is updated adding the value in the gift card
 *
 * giftcard String Code of the gift card to add encoded in BASE64 with custom obfuscation
 * no response value expected for this operation
 **/
exports.addResult = function (result_id, id1, id2, points1, points2) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_result')
            .insert({
                result_id: result_id,
                id1: id1,
                id2: id2,
                points1: points1,
                points2: points2,
                }
            )
        );
    });
}

exports.checkResult = function (result_id) {
    return new Promise(function (resolve, reject) {
        var sql = sqlDB('t_result').select('result_id').where({result_id: result_id});
        resolve(sql);
    });
}

exports.resultCreateID = function () {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_result').max({result_id: "result_id"}).first());
    });
}




