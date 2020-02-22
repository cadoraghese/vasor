'use strict';

let sqlDB;

exports.authorDBConnection = function (database) {
    sqlDB = database;
}

/**
 * Details about a specific author by public ID
 * A single ID value must be provided
 *
 * author_id Integer ID of the author to be retrieved
 * returns Author
 **/
exports.getAuthorByID = function (author_id) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB.select('t_author.author_id', 't_author.name', 't_author.surname', 't_author.birthday',
            't_author.nationality', 't_author.biography', 't_author.picture', 't_author.sex')
            .table('t_author').where('author_id', author_id));
    });
}


/**
 * List all authors
 * No information must be provided
 *
 * returns List
 **/
exports.listAllAuthors = function () {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB.select('t_author.author_id', 't_author.name', 't_author.surname', 't_author.birthday',
            't_author.nationality', 't_author.biography', 't_author.picture', 't_author.sex')
            .table('t_author')
            .orderBy('t_author.surname', 'asc'));
    });
}

/**
 * Finds authors by book
 * A single ISBN value must be provided
 *
 * isbn String ISBN value that needs to be considered for filter
 * returns List
 **/
exports.findAuthorsByBook = function (isbn) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_work').join('t_author', 't_work.author_id', 't_author.author_id').select('t_author.author_id', 't_author.name', 't_author.surname', 't_author.birthday',
            't_author.nationality', 't_author.biography', 't_author.picture', 't_author.sex')
            .where('t_work.isbn', isbn)
            .orderBy('t_author.surname', 'asc'));
    });
}

/**
 * Finds Authors by search key
 * A single search string must be provided
 *
 * search String Search words that needs to be considered for response
 * returns List
 **/
exports.searchAuthor = function (search) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB.select('*')
            .from({
                view0: sqlDB('t_author')
                    .select('*')
                    .select(sqlDB.raw('concat_ws(\' \', t_author.name, t_author.surname) as authors_full_names'))
            })
            .whereRaw(`LOWER(view0.authors_full_names) LIKE ?`, ['%' + search + '%'])
            .orderBy('view0.surname', 'asc'));
    });
}

