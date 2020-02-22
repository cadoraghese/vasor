'use strict';

var utils = require('../utils/writer.js');
var Event = require('../service/EventService');

module.exports.getEventByCode = function getEventByCode (req, res, next) {
    var eventcode = req.swagger.params['eventcode'].value;
    Event.getEventByCode(eventcode)
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                utils.writeJson(res, response[0]);
            } else {
                var err = new Error('Error 204: no event with this code');
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

module.exports.findEventsByBook = function findEventsByBook (req, res, next) {
  var isbn = req.swagger.params['isbn'].value;
  Event.findEventsByBook(isbn)
    .then(function (response) {
      if (Object.keys(response).length > 0) {
          utils.writeJson(res, response);
      } else {
          var err = new Error('Error 204: no event is related to this book');
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

module.exports.listBestEventsByPeriod = function listBestEventsByPeriod (req, res, next) {
  var initial_date = req.swagger.params['initial_date'].value;
  var ending_date = req.swagger.params['ending_date'].value;
  Event.listBestEventsByPeriod(initial_date,ending_date)
    .then(function (response) {
      if (Object.keys(response).length > 0) {
          utils.writeJson(res, response);
      } else {
          var err = new Error('Error 204: no event in this period');
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

module.exports.searchEvent = function searchEvent (req, res, next) {
    var search = req.swagger.params['search'].value;
    if(search){
        search = search.toLowerCase();
    }
    Event.searchEvent(search)
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                utils.writeJson(res, response);
            } else {
                var err = new Error('Error 204: no event for these search words');
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

