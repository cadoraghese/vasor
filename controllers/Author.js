'use strict';

var utils = require('../utils/writer.js');
var Author = require('../service/AuthorService');

module.exports.getAuthorByID = function getAuthorByID (req, res, next) {
  var author_id = req.swagger.params['author_id'].value;
  Author.getAuthorByID(author_id)
    .then(function (response) {
      if (Object.keys(response).length > 0) {
        utils.writeJson(res, response[0]);
      } else {
        var err = new Error('Error 204: no authors with this id');
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

module.exports.listAllAuthors = function listAllAuthors (req, res, next) {
  Author.listAllAuthors()
    .then(function (response) {
      if (Object.keys(response).length > 0) {
        utils.writeJson(res, response);
      } else {
        var err = new Error('Error 204: no authors');
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

module.exports.findAuthorsByBook = function findAuthorsByBook (req, res, next) {
  var isbn = req.swagger.params['isbn'].value;
  Author.findAuthorsByBook(isbn)
      .then(function (response) {
        if (Object.keys(response).length > 0) {
          utils.writeJson(res, response);
        } else {
          var err = new Error('Error 204: no authors wrote this book');
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

module.exports.searchAuthor = function searchAuthor(req, res, next) {
    var search = req.swagger.params['search'].value;
    if (search) {
        search = search.toLowerCase();
    }
    Author.searchAuthor(search)
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                utils.writeJson(res, response);
            } else {
                var err = new Error('Error 204: no author for these search words');
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
