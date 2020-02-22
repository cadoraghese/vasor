'use strict';

let sqlDB;

exports.eventDBConnection = function (database) {
    sqlDB = database;
}


/**
 * Details about a specific event by public event code
 * A single code value must be provided
 *
 * eventcode String Code of the event to be retrieved
 * returns Event
 **/
exports.getEventByCode = function (eventcode) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_event').select('t_event.eventcode', 't_event.name', 't_event.description',
            't_event.location', 't_event.date', 't_event.organizer', 't_event.website', 't_event.picture')
            .where('eventcode', eventcode));
    });
}

/**
 * Finds events by book
 * A single ISBN value must be provided
 *
 * isbn String ISBN value that needs to be considered for filter
 * returns List
 **/
exports.findEventsByBook = function (isbn) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_event').join('t_presentation', 't_event.eventcode', 't_presentation.eventcode')
            .select('t_event.eventcode', 't_event.name', 't_event.description',
                't_event.location', 't_event.date', 't_event.organizer', 't_event.website', 't_event.picture')
            .where('t_presentation.isbn', isbn));
    });
}

/**
 * List events in the selected period
 * Two dates as to be provided, the initial date of the period and the final date
 *
 * initial_date String Initial date that needs to be considered for filter
 * ending_date String Ending date that needs to be considered for filter
 * returns List
 **/
exports.listBestEventsByPeriod = function (initial_date, ending_date) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_event').select('t_event.eventcode', 't_event.name', 't_event.description',
            't_event.location', 't_event.date', 't_event.organizer', 't_event.website', 't_event.picture')
            .whereBetween('date', [initial_date, ending_date])
            .orderBy('t_event.date', 'asc'));
    });
}

/**
 * Finds Events by search key
 * A single search string must be provided
 *
 * search String Search words that needs to be considered for response
 * returns List
 **/
exports.searchEvent = function (search) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB.select('*')
            .from('t_event')
            .whereRaw(`LOWER(name) LIKE ?`, ['%' + search + '%'])
            .orderBy('date', 'desc'));
    });
}


