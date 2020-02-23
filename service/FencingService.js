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
        resolve(sqlDB('t_fencer').select('fencer_id', 'name', 'surname', 'nickname', 'year')
            .orderBy('name'));
    });
}


exports.getResults = function (initial_date, ending_date) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_result').join('t_fencer AS t_fencer_1', 't_fencer_1.fencer_id', 't_result.id1')
            .join('t_fencer AS t_fencer_2', 't_fencer_2.fencer_id', 't_result.id2')
            .select('t_fencer_1.fencer_id AS id1', 't_fencer_1.name AS name1', 't_fencer_1.surname AS surname1', 't_fencer_1.nickname AS nickname1',
                't_fencer_2.fencer_id AS id2', 't_fencer_2.name AS name2', 't_fencer_2.surname AS surname2', 't_fencer_2.nickname AS nickname2',
                't_result.points1', 't_result.points2', 't_result.date')
            .whereBetween('date', [initial_date, ending_date]))
    });
}


/**
 * Add gift card value to current user credit
 * The account credit of the logged user is updated adding the value in the gift card
 *
 * giftcard String Code of the gift card to add encoded in BASE64 with custom obfuscation
 * no response value expected for this operation
 **/
exports.addResult = function (result_id, id1, id2, points1, points2, date) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_result')
            .insert({
                result_id: result_id,
                id1: id1,
                id2: id2,
                points1: points1,
                points2: points2,
                date: date,
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




