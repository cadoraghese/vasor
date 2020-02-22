'use strict';

let sqlDB;

exports.bookDBConnection = function (database) {
    sqlDB = database;
}


/**
 * Details about a specific book by ISBN
 * A single ISBN value must be provided
 *
 * isbn String ISBN of the book to be retrieved
 * returns Book
 **/
exports.getBookByISBN = function (isbn) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB()
            .select('view2.isbn', 'view2.authors', 'view2.themes')
            .select('books.title', 'books.description', 'books.genre', 'books.picture', 'books.list_price',
                'books.price', 'books.pages', 'books.publisher', 'books.release_date', 'books.format', 'books.collection',
                'books.language', 'books.availability', 'books.editor_choice')//, 'total AS totality')
            .from({
                view2: sqlDB('view1')
                    .select('view1.isbn', 'view1.authors')
                    .select(sqlDB.raw('string_agg(t_theme.theme, \',\') as themes'))
                    .from({
                        view1: sqlDB('t_book')
                            .select('t_book.isbn')
                            .select(sqlDB.raw('string_agg(concat_ws(\':\', t_author.author_id, concat_ws(\' \', t_author.name, t_author.surname)), \',\') as authors'))
                            .join('t_work AS t_work_2', 't_work_2.isbn', 't_book.isbn')
                            .join('t_author', 't_author.author_id', 't_work_2.author_id')
                            .where('t_book.isbn', isbn)
                            .groupBy('t_book.isbn')
                    })
                    .join('t_theme', 't_theme.isbn', 'view1.isbn')
                    .groupByRaw('view1.isbn, view1.authors')
            })
            .join('t_book AS books', 'books.isbn', 'view2.isbn'))
        ;
    });
}

/**
 * Finds Books by genre
 * A single genre value must be provided
 *
 * genre String Genre value that needs to be considered for filter
 * returns List
 **/
exports.findBookByGenre = function (genre) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB()
            .select('view2.isbn', 'view2.authors', 'view2.themes')
            .select('books.title', 'books.description', 'books.genre', 'books.picture', 'books.list_price',
                'books.price', 'books.pages', 'books.publisher', 'books.release_date', 'books.format', 'books.collection',
                'books.language', 'books.availability', 'books.editor_choice')//, 'total AS totality')
            .from({
                view2: sqlDB('view1')
                    .select('view1.isbn', 'view1.authors')
                    .select(sqlDB.raw('string_agg(t_theme.theme, \',\') as themes'))
                    .from({
                        view1: sqlDB('t_book')
                            .select('t_book.isbn')
                            .select(sqlDB.raw('string_agg(concat_ws(\':\', t_author.author_id, concat_ws(\' \', t_author.name, t_author.surname)), \',\') as authors'))
                            .join('t_work AS t_work_2', 't_work_2.isbn', 't_book.isbn')
                            .join('t_author', 't_author.author_id', 't_work_2.author_id')
                            .where('genre', genre)
                            .groupBy('t_book.isbn')
                    })
                    .join('t_theme', 't_theme.isbn', 'view1.isbn')
                    .groupByRaw('view1.isbn, view1.authors')
            })
            .join('t_book AS books', 'books.isbn', 'view2.isbn')
            .orderBy('books.release_date', 'desc'));
    });
}

/**
 * Finds Books by theme
 * Multiple theme values can be provided with comma separated strings
 *
 * theme List Theme values that need to be considered for filter
 * returns List
 **/
exports.findBookByTheme = function (themes) {
    return new Promise(function (resolve, reject) {
        var query = sqlDB('t_book')
            .select('t_book.isbn')
            .select(sqlDB.raw('string_agg(concat_ws(\':\', t_author.author_id, concat_ws(\' \', t_author.name, t_author.surname)), \',\') as authors'))
            .join('t_theme', 't_theme.isbn', 't_book.isbn')
            .join('t_work AS t_work_2', 't_work_2.isbn', 't_book.isbn')
            .join('t_author', 't_author.author_id', 't_work_2.author_id')
            .groupBy('t_book.isbn')
            .where('t_theme.theme', themes[0]);
        themes.forEach(function (theme) {
            query = query.orWhere('t_theme.theme', theme);
        });
        query = sqlDB()
            .select('view2.isbn', 'view2.authors', 'view2.themes')
            .select('books.title', 'books.description', 'books.genre', 'books.picture', 'books.list_price',
                'books.price', 'books.pages', 'books.publisher', 'books.release_date', 'books.format', 'books.collection',
                'books.language', 'books.availability', 'books.editor_choice')//, 'total AS totality')
            .from({
                view2: sqlDB('view1')
                    .select('view1.isbn', 'view1.authors')
                    .select(sqlDB.raw('string_agg(t_theme.theme, \',\') as themes'))
                    .from({
                        view1: query
                    })
                    .join('t_theme', 't_theme.isbn', 'view1.isbn')
                    .groupByRaw('view1.isbn, view1.authors')
            })
            .join('t_book AS books', 'books.isbn', 'view2.isbn')
            .orderBy('books.release_date', 'desc');
        resolve(query);
    });
}

/**
 * Finds Books by similarity
 * A single ISBN value must be provided
 *
 * isbn String ISBN value that needs to be considered for filter
 * returns List
 **/
exports.findBookBySimilarity = function (isbn) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB()
            .select('view2.isbn', 'view2.authors', 'view2.themes')
            .select('books.title', 'books.description', 'books.genre', 'books.picture', 'books.list_price',
                'books.price', 'books.pages', 'books.publisher', 'books.release_date', 'books.format', 'books.collection',
                'books.language', 'books.availability', 'books.editor_choice')//, 'total AS totality')
            .from({
                view2: sqlDB('view1')
                    .select('view1.isbn', 'view1.authors')
                    .select(sqlDB.raw('string_agg(t_theme.theme, \',\') as themes'))
                    .from({
                        view1: sqlDB('t_book')
                            .select('t_book.isbn')
                            .select(sqlDB.raw('string_agg(concat_ws(\':\', t_author.author_id, concat_ws(\' \', t_author.name, t_author.surname)), \',\') as authors'))
                            .join('t_similar_book', 't_similar_book.similar_isbn', 't_book.isbn')
                            .join('t_work AS t_work_2', 't_work_2.isbn', 't_book.isbn')
                            .join('t_author', 't_author.author_id', 't_work_2.author_id')
                            .where('t_similar_book.isbn', isbn)
                            .groupBy('t_book.isbn')
                    })
                    .join('t_theme', 't_theme.isbn', 'view1.isbn')
                    .groupByRaw('view1.isbn, view1.authors')
            })
            .join('t_book AS books', 'books.isbn', 'view2.isbn')
            .orderBy('books.release_date', 'desc'));
    });
}

/**
 * Finds Books by author
 * A single Author id value must be provided
 *
 * author_id String Author value that needs to be considered for filter
 * returns List
 **/
exports.findBookByAuthor = function (author_id) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB()
            .select('view2.isbn', 'view2.authors', 'view2.themes')
            .select('books.title', 'books.description', 'books.genre', 'books.picture', 'books.list_price',
                'books.price', 'books.pages', 'books.publisher', 'books.release_date', 'books.format', 'books.collection',
                'books.language', 'books.availability', 'books.editor_choice')//, 'total AS totality')
            .from({
                view2: sqlDB('view1')
                    .select('view1.isbn', 'view1.authors')
                    .select(sqlDB.raw('string_agg(t_theme.theme, \',\') as themes'))
                    .from({
                        view1: sqlDB('t_book')
                            .select('t_book.isbn')
                            .select(sqlDB.raw('string_agg(concat_ws(\':\', t_author.author_id, concat_ws(\' \', t_author.name, t_author.surname)), \',\') as authors'))
                            .join('t_work', 't_work.isbn', 't_book.isbn')
                            .join('t_work AS t_work_2', 't_work_2.isbn', 't_book.isbn')
                            .join('t_author', 't_author.author_id', 't_work_2.author_id')
                            .where('t_work.author_id', author_id)
                            .groupBy('t_book.isbn')
                    })
                    .join('t_theme', 't_theme.isbn', 'view1.isbn')
                    .groupByRaw('view1.isbn, view1.authors')
            })
            .join('t_book AS books', 'books.isbn', 'view2.isbn')
            .orderBy('books.release_date', 'desc'));
    });
}

/**
 * Finds Books by presentation event
 * A single event value must be provided
 *
 * eventcode String Event code value that needs to be considered for filter
 * returns List
 **/
exports.findBookByEvent = function (eventcode) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB()
            .select('view2.isbn', 'view2.authors', 'view2.themes')
            .select('books.title', 'books.description', 'books.genre', 'books.picture', 'books.list_price',
                'books.price', 'books.pages', 'books.publisher', 'books.release_date', 'books.format', 'books.collection',
                'books.language', 'books.availability', 'books.editor_choice')//, 'total AS totality')
            .from({
                view2: sqlDB('view1')
                    .select('view1.isbn', 'view1.authors')
                    .select(sqlDB.raw('string_agg(t_theme.theme, \',\') as themes'))
                    .from({
                        view1: sqlDB('t_book')
                            .select('t_book.isbn')
                            .select(sqlDB.raw('string_agg(concat_ws(\':\', t_author.author_id, concat_ws(\' \', t_author.name, t_author.surname)), \',\') as authors'))
                            .join('t_presentation', 't_presentation.isbn', 't_book.isbn')
                            .join('t_work AS t_work_2', 't_work_2.isbn', 't_book.isbn')
                            .join('t_author', 't_author.author_id', 't_work_2.author_id')
                            .where('t_presentation.eventcode', eventcode)
                            .groupBy('t_book.isbn')
                    })
                    .join('t_theme', 't_theme.isbn', 'view1.isbn')
                    .groupByRaw('view1.isbn, view1.authors')
            })
            .join('t_book AS books', 'books.isbn', 'view2.isbn')
            .orderBy('books.release_date', 'desc'));
    });
}

/**
 * List books in our favorite readings list
 * No additional parameters required
 *
 * returns List
 **/
exports.listSuggestedReadings = function () {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB()
            .select('view2.isbn', 'view2.authors', 'view2.themes')
            .select('books.title', 'books.description', 'books.genre', 'books.picture', 'books.list_price',
                'books.price', 'books.pages', 'books.publisher', 'books.release_date', 'books.format', 'books.collection',
                'books.language', 'books.availability', 'books.editor_choice')//, 'total AS totality')
            .from({
                view2: sqlDB('view1')
                    .select('view1.isbn', 'view1.authors')
                    .select(sqlDB.raw('string_agg(t_theme.theme, \',\') as themes'))
                    .from({
                        view1: sqlDB('t_book')
                            .select('t_book.isbn')
                            .select(sqlDB.raw('string_agg(concat_ws(\':\', t_author.author_id, concat_ws(\' \', t_author.name, t_author.surname)), \',\') as authors'))
                            .join('t_work AS t_work_2', 't_work_2.isbn', 't_book.isbn')
                            .join('t_author', 't_author.author_id', 't_work_2.author_id')
                            .where('editor_choice', 1)
                            .groupBy('t_book.isbn')
                    })
                    .join('t_theme', 't_theme.isbn', 'view1.isbn')
                    .groupByRaw('view1.isbn, view1.authors')
            })
            .join('t_book AS books', 'books.isbn', 'view2.isbn')
            .orderBy('books.release_date', 'desc'));
    });
}

/**
 * List best sellers in the selected period
 * Two dates as to be provided, the initial date of the period and the final date
 *
 * initial_date String Initial date that needs to be considered for filter
 * ending_date String Ending date that needs to be considered for filter
 * returns List
 **/
exports.listBestSellersByPeriod = function (initial_date, ending_date) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB()
            .select('view2.isbn', 'view2.authors', 'view2.themes')
            .select(sqlDB.raw('view2.total2 as total'))
            .select('books.title', 'books.description', 'books.genre', 'books.picture', 'books.list_price',
                'books.price', 'books.pages', 'books.publisher', 'books.release_date', 'books.format', 'books.collection',
                'books.language', 'books.availability', 'books.editor_choice')//, 'total AS totality')
            .from({
                view2: sqlDB('view1')
                    .select('view1.isbn', 'view1.authors')
                    .select(sqlDB.raw('string_agg(t_theme.theme, \',\') as themes'))
                    .from({
                        view1: sqlDB('view0')
                            .select('view0.isbn')
                            //                    .select(sqlDB.raw('total'))
                            .select(sqlDB.raw('string_agg(concat_ws(\':\', t_author.author_id, concat_ws(\' \', t_author.name, t_author.surname)), \',\') as authors'))
                            .from({
                                view0: sqlDB('t_book')
                                    .select('t_book.isbn')
                                    .join('t_order_composition', 't_book.isbn', 't_order_composition.isbn')
                                    .join('t_order', 't_order.order_number', 't_order_composition.order_number')
                                    .whereBetween('t_order.date', [initial_date, ending_date])
                                    .groupBy('t_book.isbn')
                                    .sum('t_order_composition.quantity AS total0')
                            })
                            .join('t_work AS t_work_2', 't_work_2.isbn', 'view0.isbn')
                            .join('t_author', 't_author.author_id', 't_work_2.author_id')
                            .max('view0.total0 as total1')
                            .groupBy('view0.isbn')
                    })
                    .join('t_theme', 't_theme.isbn', 'view1.isbn')
                    .max('view1.total1 as total2')
                    .groupByRaw('view1.isbn, view1.authors')
            })
            .join('t_book AS books', 'books.isbn', 'view2.isbn')
            .orderBy('total', 'desc'));
    });
}

/**
 * List all the books from the most recently published one
 * No additional parameters required
 *
 * returns List
 **/
exports.latest = function () {
    return new Promise(function (resolve, reject) {
        var now = new Date().toISOString();
        resolve(sqlDB()
            .select('view2.isbn', 'view2.authors', 'view2.themes')
            .select('books.title', 'books.description', 'books.genre', 'books.picture', 'books.list_price',
                'books.price', 'books.pages', 'books.publisher', 'books.release_date', 'books.format', 'books.collection',
                'books.language', 'books.availability', 'books.editor_choice')//, 'total AS totality')
            .from({
                view2: sqlDB('view1')
                    .select('view1.isbn', 'view1.authors')
                    .select(sqlDB.raw('string_agg(t_theme.theme, \',\') as themes'))
                    .from({
                        view1: sqlDB('t_book')
                            .select('t_book.isbn')
                            .select(sqlDB.raw('string_agg(concat_ws(\':\', t_author.author_id, concat_ws(\' \', t_author.name, t_author.surname)), \',\') as authors'))
                            .join('t_work AS t_work_2', 't_work_2.isbn', 't_book.isbn')
                            .join('t_author', 't_author.author_id', 't_work_2.author_id')
                            .where('t_book.release_date', '<', now)
                            .groupBy('t_book.isbn')
                    })
                    .join('t_theme', 't_theme.isbn', 'view1.isbn')
                    .groupByRaw('view1.isbn, view1.authors')
            })
            .join('t_book AS books', 'books.isbn', 'view2.isbn')
            .orderBy('books.release_date', 'desc'));
    });
}

/**
 * Get the list of all the books' genres
 * No additional parameters required
 *
 * returns List
 **/
exports.listGenres = function () {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_book').distinct('genre').orderBy('genre', 'asc'));
    });
}

/**
 * Get the list of all the books' themes
 * No additional parameters required
 *
 * returns List
 **/
exports.listThemes = function () {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_theme').distinct('theme').orderBy('theme', 'asc'));
    });
}


/**
 * Finds Books by search key
 * A single search string must be provided
 *
 * search String Search words that needs to be considered for response
 * returns List
 **/
//Single word version
exports.searchBook = function (search) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB()
            .select('view2.isbn', 'view2.authors', 'view2.themes')
            .select('books.title', 'books.description', 'books.genre', 'books.picture', 'books.list_price',
                'books.price', 'books.pages', 'books.publisher', 'books.release_date', 'books.format', 'books.collection',
                'books.language', 'books.availability', 'books.editor_choice')//, 'total AS totality')
            .from({
                view2: sqlDB('view1')
                    .select('view1.isbn', 'view1.authors')
                    .select(sqlDB.raw('string_agg(t_theme.theme, \',\') as themes'))
                    .from({
                        view1: sqlDB('view0')
                            .select('t_book.isbn')
                            .select(sqlDB.raw('string_agg(concat_ws(\':\', t_author.author_id, concat_ws(\' \', t_author.name, t_author.surname)), \',\') as authors'))
                            .from({
                                view0: sqlDB('t_author')
                                    .select('t_author.author_id')
                                    .select(sqlDB.raw('concat_ws(\' \', t_author.name, t_author.surname) as authors_full_names'))
                            })
                            .join('t_author', 't_author.author_id', 'view0.author_id')
                            .join('t_work AS t_work_2', 't_work_2.author_id', 't_author.author_id')
                            .join('t_book', 't_work_2.isbn', 't_book.isbn')
                            .whereRaw(`LOWER(t_book.title) LIKE ?`, ['%' + search + '%'])
                            .orWhere(function () {
                                this.whereRaw(`LOWER(view0.authors_full_names) LIKE ?`, ['%' + search + '%'])
                            })
                            .orWhere(function () {
                                this.whereRaw(`LOWER(t_book.isbn) LIKE ?`, ['%' + search + '%'])
                            })
                            .groupBy('t_book.isbn')
                    })
                    .join('t_theme', 't_theme.isbn', 'view1.isbn')
                    .groupByRaw('view1.isbn, view1.authors')
            })
            .join('t_book AS books', 'books.isbn', 'view2.isbn')
            .orderBy('books.release_date', 'desc'));
    });
}

/**
 * Finds Books by search key
 * A single search string must be provided
 *
 * search String Search words that needs to be considered for response
 * returns List
 **/
//Many words version
/*exports.searchBook = function(search_words) {
    return new Promise(function(resolve, reject) {
        var inner_part = sqlDB('view0')
            .select('t_book.isbn')
            .select(sqlDB.raw('string_agg(concat_ws(\':\', t_author.author_id, concat_ws(\' \', t_author.name, t_author.surname)), \',\') as authors'))
            .from({view0: sqlDB('t_author')
                    .select('t_author.author_id')
                    .select(sqlDB.raw('concat_ws(\' \', t_author.name, t_author.surname) as authors_full_names'))
            })
            .join('t_author', 't_author.author_id', 'view0.author_id')
            .join('t_work AS t_work_2', 't_work_2.author_id', 't_author.author_id')
            .join('t_book', 't_work_2.isbn', 't_book.isbn')
            .whereRaw(`LOWER(t_book.title) LIKE ?`, ['%' + search_words[0] + '%']);
        console.log(search_words);
        for(var x in search_words){
            console.log(search_words[x]);
            inner_part = inner_part
                .orWhere(function() {
                    this.whereRaw(`LOWER(view0.authors_full_names) LIKE ?`, ['%' + search_words[x] + '%'])
                })
                .orWhere(function() {
                    this.whereRaw(`LOWER(t_book.isbn) LIKE ?`, ['%' + search_words[x] + '%'])
                })
                .orWhere(function() {
                    this.whereRaw(`LOWER(t_book.title) LIKE ?`, ['%' + search_words[x] + '%'])
                });
            console.log(search_words[x]);

        }
        inner_part = inner_part.groupBy('t_book.isbn');
        console.log(inner_part.toString());
        resolve(sqlDB()
            .select('view2.isbn', 'view2.authors', 'view2.themes')
            .select('books.title', 'books.description', 'books.genre', 'books.picture', 'books.list_price',
                'books.price', 'books.pages', 'books.publisher', 'books.release_date', 'books.format', 'books.collection',
                'books.language', 'books.availability', 'books.editor_choice')//, 'total AS totality')
            .from({view2: sqlDB('view1')
                    .select('view1.isbn', 'view1.authors')
                    .select(sqlDB.raw('string_agg(t_theme.theme, \',\') as themes'))
                    .from({view1: inner_part})
                    .join('t_theme', 't_theme.isbn', 'view1.isbn')
                    .groupByRaw('view1.isbn, view1.authors')
            })
            .join('t_book AS books', 'books.isbn', 'view2.isbn')
            .orderBy('books.release_date', 'desc'));
    });
}
*/

