'use strict';

var utils = require('../utils/writer.js');
var Book = require('../service/BookService');

module.exports.getBookByISBN = function getBookByISBN(req, res, next) {
    var isbn = req.swagger.params['isbn'].value;
    Book.getBookByISBN(isbn)
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                utils.writeJson(res, response[0]);
            } else {
                var err = new Error('Error 204: no book with this isbn');
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

module.exports.findBookByGenre = function findBookByGenre(req, res, next) {
    var genre = req.swagger.params['genre'].value;
    Book.findBookByGenre(genre)
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                utils.writeJson(res, response);
            } else {
                var err = new Error('Error 204: no book of this genre');
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

module.exports.findBookByTheme = function findBookByTheme(req, res, next) {
    var theme = req.swagger.params['theme'].value;
    Book.findBookByTheme(theme)
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                utils.writeJson(res, response);
            } else {
                var err = new Error('Error 204: no books with this theme');
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

module.exports.findBookBySimilarity = function findBookBySimilarity(req, res, next) {
    var isbn = req.swagger.params['isbn'].value;
    Book.findBookBySimilarity(isbn)
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                utils.writeJson(res, response);
            } else {
                var err = new Error('Error 204: no books similar to the one indicated');
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

module.exports.findBookByAuthor = function findBookByAuthor(req, res, next) {
    var author_id = req.swagger.params['author_id'].value;
    Book.findBookByAuthor(author_id)
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                utils.writeJson(res, response);
            } else {
                var err = new Error('Error 204: no books from this author');
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

module.exports.findBookByEvent = function findBookByEvent(req, res, next) {
    var eventcode = req.swagger.params['eventcode'].value;
    Book.findBookByEvent(eventcode)
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                utils.writeJson(res, response);
            } else {
                var err = new Error('Error 204: no books presented at this event');
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

module.exports.listSuggestedReadings = function listSuggestedReadings(req, res, next) {
    Book.listSuggestedReadings()
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                utils.writeJson(res, response);
            } else {
                var err = new Error('Error 204: no suggested readings');
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

module.exports.listBestSellersByPeriod = function listBestSellersByPeriod(req, res, next) {
    var initial_date = req.swagger.params['initial_date'].value;
    var ending_date = req.swagger.params['ending_date'].value;
    Book.listBestSellersByPeriod(initial_date, ending_date)
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                utils.writeJson(res, response);
            } else {
                var err = new Error('Error 204: no books were sold in this period');
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

module.exports.latest = function latest(req, res, next) {
    Book.latest()
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response, 400);
        });
};

module.exports.listGenres = function listGenres(req, res, next) {
    Book.listGenres()
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                utils.writeJson(res, response);
            } else {
                var err = new Error('Error 204: no genres');
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

module.exports.listThemes = function listThemes(req, res, next) {
    Book.listThemes()
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                utils.writeJson(res, response);
            } else {
                var err = new Error('Error 204: no themes');
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

module.exports.searchBook = function searchBook(req, res, next) {
    var search = req.swagger.params['search'].value;
    /*  var search_array = [];
      if(search){
          search = search.toLowerCase();
          search_array = search.split(' ');
      } else {
          search_array[0]=search;
      }
      Book.searchBook(search_array)*/
    if (search) {
        search = search.toLowerCase();
    }
    Book.searchBook(search)
        .then(function (response) {
            if (Object.keys(response).length > 0) {
                utils.writeJson(res, response);
            } else {
                var err = new Error('Error 204: no book for these search words');
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
