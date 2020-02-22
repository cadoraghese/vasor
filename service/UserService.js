'use strict';

var auth = require("../auth");
let sqlDB;

const bcrypt = require('bcryptjs');
const saltRounds = 10;

exports.userDBConnection = function (database) {
    sqlDB = database;
}


/**
 * Retrieves profile information for the current user
 * The data is retrieved for the user in the current session
 *
 * returns UserDetails
 **/
exports.profileDetails = function (user_id) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_user').select('name', 'surname', 'username', 'email', 'birthday').where('user_id', user_id));
    });
}

/**
 * Send sign up request
 * A sign up request is sent with the information provided
 *
 * name String The name of the user
 * surname String The surname of the user
 * password String
 * username String The username of the user
 * email String The email of the user
 * birthday String The birthday of the user
 * no response value expected for this operation
 **/
exports.insertUser = function (user_id, name, surname, password, username, email, birthday) {
    return new Promise(function (resolve, reject) {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            password = hash;
            resolve(sqlDB('t_user')
                .insert({
                    user_id: user_id,
                    name: name,
                    surname: surname,
                    password: password,
                    username: username,
                    email: email,
                    birthday: birthday,
                }));
        });
    });
}

/**
 * Send sign in request
 * A sign in request is sent with the information provided
 *
 * email String The email of the user
 * password String The password of the user
 * returns inline_response_200_1
 **/
exports.checkCredentials = function (email, hash) {
    return new Promise(function (resolve, reject) {
        var sql;
//    console.log("in checkCredential beginning");
        var sql = sqlDB('t_user').select('user_id').where({email: email, password: hash});
        resolve(sql);
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

exports.userCreateID = function () {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_user').max({user_id: "user_id"}).first());
    });
}

exports.resultCreateID = function () {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_result').max({result_id: "result_id"}).first());
    });
}

exports.getHash = function (email) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB("t_user").select("password").where('email', email).first())
    });
}

exports.getAccountCredit = function (user_id) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB("t_user").select("account_credit").where('user_id', user_id).first())
    });
}



