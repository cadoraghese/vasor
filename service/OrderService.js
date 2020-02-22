'use strict';

let sqlDB;

exports.orderDBConnection = function (database) {
    sqlDB = database;
}

/**
 * Finds orders for the logged user
 * No additional parameters required
 *
 * returns List
 **/
exports.ordersList = function (user_id) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_order')
            .join('t_order_composition', 't_order.order_number', 't_order_composition.order_number')
            .join('t_book', 't_book.isbn', 't_order_composition.isbn')
            .select('t_order.order_number')
            .select(sqlDB.raw('string_agg(concat_ws(\'{\', t_order_composition.isbn, ' +
                'concat_ws(\'{\', t_book.title, ' +
                'concat_ws(\'{\', t_book.picture, ' +
                'concat_ws(\'{\', t_order_composition.quantity, t_order_composition.price)))), \'~\') as order_details'))
            .select('t_order.date', 't_order.shipping_date', 't_order.payment_method', 't_order.tracking_number', 't_order.status', 't_order.address')
            .where('t_order.user_id', user_id)
            .groupBy('t_order.order_number')
            .orderBy([{column: 't_order.date', order: 'desc'}, {column: 't_order.order_number', order: 'desc'}]));
    });
}

/**
 * Place order for selected items
 * The items are added to the orders list for the logged user
 *
 * order Order order placed for purchasing the books (optional)
 * no response value expected for this operation
 **/
exports.insertOrder = function (order) {
    return new Promise(function (resolve, reject) {

        var insert_part = []
        var total_price = 0;
        for (var i in order.order_details) {
            var item = order.order_details[i];
            insert_part.push({
                "isbn": item.isbn,
                "order_number": order.order_number,
                "quantity": item.quantity,
                "price": item.price,
            });
            total_price = total_price + item.price * item.quantity;
        }

        if (order.old_account_credit < total_price) {
            total_price = order.old_account_credit;
        }

        resolve(sqlDB
            .transaction(function (t) {
                return sqlDB("t_order")
                    .transacting(t)
                    .insert({
                        order_number: order.order_number,
                        payment_method: order.payment_method,
                        date: order.date,
                        status: order.status,
                        address: order.address,
                        user_id: order.user_id,
                        shipping_date: order.shipping_date,
                        tracking_number: order.tracking_number
                    })
                    .then(function (response) {
                        return sqlDB('t_order_composition')
                            .transacting(t)
                            .insert(insert_part)
                            .then(function (response) {
                                return sqlDB('t_user')
                                    .transacting(t)
                                    .where('user_id', order.user_id)
                                    .update('account_credit', order.old_account_credit - total_price)
                                    /**/.then(function (response) {
                                        var remove_part = sqlDB('t_shopping_cart')
                                            .transacting(t)
                                            .where(sqlDB.raw('False'));
                                        for (var i in order.order_details) {
                                            remove_part.orWhere({
                                                't_shopping_cart.isbn': order.order_details[i].isbn,
                                                't_shopping_cart.user_id': order.user_id
                                            });
                                        }
                                        remove_part.del();
                                        return remove_part;
                                    })/**/
                            })
                    })
                    .then(t.commit)
                    .catch(t.rollback)
            })
            .then(function () {
            })
            .catch(function () {
            }));
    });
}

/**
 * Finds Orders by search key
 * A single search string must be provided
 *
 * search String Search words that needs to be considered for response
 * returns List
 **/
exports.searchOrder = function (search, user_id) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_order')
            .select('*')
            .from({
                view0: sqlDB('t_order')
                    .select('t_order.order_number')
                    .select(sqlDB.raw('string_agg(concat_ws(\'{\', t_order_composition.isbn, ' +
                        'concat_ws(\'{\', t_book.title, ' +
                        'concat_ws(\'{\', t_book.picture, ' +
                        'concat_ws(\'{\', t_order_composition.quantity, t_order_composition.price)))), \'~\') as order_details'))
                    .select('t_order.date', 't_order.shipping_date', 't_order.payment_method', 't_order.tracking_number', 't_order.status', 't_order.address')
                    .join('t_order_composition', 't_order.order_number', 't_order_composition.order_number')
                    .join('t_book', 't_book.isbn', 't_order_composition.isbn')
                    .where('t_order.user_id', user_id)
                    .groupBy('t_order.order_number')
                    .orderBy([{column: 't_order.date', order: 'desc'}, {column: 't_order.order_number', order: 'desc'}])
            })
            .whereRaw(`LOWER(view0.order_details) LIKE ?`, ['%' + search + '%'])
            .orderBy([{column: 'view0.date', order: 'desc'}, {column: 'view0.order_number', order: 'desc'}])
        );
    });
}


exports.orderCreateID = function () {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_order').max({order_number: "order_number"}).first());
    });
}

exports.checkOrder = function (order_number) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_order').select().where('order_number', order_number));
    });
}

