'use strict';

//TODO cite https://github.com/miguelduarte42/swagger-jwt-example

var utils = require('./utils/writer');

let jwt = require('jsonwebtoken');
var sharedSecret = "secretWord";
var issuer = "localhost:8080";

exports.verifyToken = function (req, authOrSecDef, token, callback) {
    function sendError() {
        utils.writeJson(req.res, "Error 401: session expired", 401);
        return req.res;
    }

    //validate the 'Authorization' header. it should have the following format:
    //'Bearer tokenString'
    if (token && token.indexOf("api_key ") == 0) {
        var tokenString = token.split(" ")[1];
        jwt.verify(tokenString, sharedSecret, function (
            verificationError,
            decodedToken
        ) {
            //check if the JWT was verified correctly
            if (
                verificationError == null &&
                decodedToken
            ) {
                // check if the issuer matches
                var issuerMatch = decodedToken.iss == issuer;

                // you can add more verification checks for the
                // token here if necessary, such as checking if
                // the username belongs to an active user

                if (issuerMatch) {
                    //add the token to the request so that we
                    //can access it in the endpoint code if necessary
                    req.auth = decodedToken;
                    //if there is no error, just return null in the callback
                    return callback(null);
                } else {
                    //return the error in the callback if there is one
                    return callback(sendError());
                }
            } else {
                //return the error in the callback if the JWT was not verified
                return callback(sendError());
            }
        });
    } else {
        //return the error in the callback if the Authorization header doesn't have the correct format
        return callback(sendError());
    }
};

exports.issueToken = function (user_id) {
    var token = jwt.sign(
        {
            sub: user_id,
            iss: issuer,
        },
        sharedSecret,
        {expiresIn: '24h'}
    );
    return token;
}

exports.getUserIdFromToken = function (token) {
    let user_id = "";
    jwt.verify(token, sharedSecret, function (verificationError, decodedToken) {
        user_id = decodedToken.sub;
    });
    return user_id;
};


