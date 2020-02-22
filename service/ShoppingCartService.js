'use strict';

let sqlDB;

exports.cartDBConnection = function (database) {
    sqlDB = database;
}


/**
 * Finds items in the shopping cart for the logged user
 * No additional parameters required
 *
 * returns List
 **/
exports.shoppingCartList = function (user_id) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_shopping_cart')
            .join('t_book', 't_shopping_cart.isbn', 't_book.isbn')
            .select('t_shopping_cart.isbn', 't_shopping_cart.quantity')
            .select('t_book.title', 't_book.description', 't_book.genre', 't_book.picture', 't_book.list_price',
                't_book.price', 't_book.pages', 't_book.publisher', 't_book.release_date', 't_book.format', 't_book.collection',
                't_book.language', 't_book.availability', 't_book.editor_choice')
            .where('t_shopping_cart.user_id', user_id));
    });
}

/**
 * Add item to the shopping cart
 * The item is added to the current user's shopping cart
 *
 * shopping_cart ShoppingCartItem shopping_cart item that needs to be added to the cart (optional)
 * no response value expected for this operation
 **/
exports.shoppingCartAdd = function (shopping_cart, quantity) {
    return new Promise(function (resolve, reject) {
        if (quantity == 0) {
            resolve(sqlDB('t_shopping_cart')
                .insert({isbn: shopping_cart.isbn, quantity: shopping_cart.quantity, user_id: shopping_cart.user_id})
//          .returning('quantity')
            );
        } else {
            resolve(sqlDB('t_shopping_cart')
                .where({user_id: shopping_cart.user_id, isbn: shopping_cart.isbn})
                .update('quantity', shopping_cart.quantity + quantity)
//          .returning('quantity')
            );
        }
    });
}

/**
 * Remove item from the shopping cart
 * The item is removed from the current user's shopping cart
 *
 * shopping_cart ShoppingCartItem shopping_cart item that needs to be deleted from the cart (optional)
 * no response value expected for this operation
 **/
exports.shoppingCartRemove = function (shopping_cart) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_shopping_cart')
            .where({isbn: shopping_cart.isbn, user_id: shopping_cart.user_id})
            .del());
    });
}

/**
 * Finds items by search key
 * A single search string must be provided
 *
 * search String Search words that needs to be considered for response
 * returns List
 **/
exports.searchCart = function (search, user_id) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_shopping_cart')
            .join('t_book', 'view0.isbn', 't_book.isbn')
            .select('view0.isbn', 'view0.quantity')
            .select('t_book.title', 't_book.description', 't_book.genre', 't_book.picture', 't_book.list_price',
                't_book.price', 't_book.pages', 't_book.publisher', 't_book.release_date', 't_book.format', 't_book.collection',
                't_book.language', 't_book.availability', 't_book.editor_choice')
            .from({
                view0: sqlDB('t_shopping_cart')
                    .select('*')
                    .where('t_shopping_cart.user_id', user_id)
            })
            .whereRaw(`LOWER(t_book.title) LIKE ?`, ['%' + search + '%'])
            .orWhere(function () {
                this.whereRaw(`LOWER(t_book.isbn) LIKE ?`, ['%' + search + '%'])
            })
            .orderBy('t_book.title', 'asc')
        );
    });
}


exports.checkShoppingCart = function (user_id, isbn) {
    return new Promise(function (resolve, reject) {
        resolve(sqlDB('t_shopping_cart').select().where({user_id: user_id, isbn: isbn}));
    });
}



