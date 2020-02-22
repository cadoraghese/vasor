const sqlDbFactory = require("knex");

let {authorDBConnection} = require("./AuthorService");
let {bookDBConnection} = require("./BookService");
let {eventDBConnection} = require("./EventService");
let {orderDBConnection} = require("./OrderService");
let {cartDBConnection} = require("./ShoppingCartService");
let {userDBConnection} = require("./UserService");
let {fencingDBConnection} = require("./FencingService");

function setUpDB() {
    return new Promise(function (resolve, reject) {
        resolve();
    });
}


let sqlDB = sqlDbFactory({
    client: 'pg',
    version: '11.2',
    connection: {
        host: 'ec2-46-137-177-160.eu-west-1.compute.amazonaws.com',
        user: 'lptjaibtvagnfv',
        password: 'fdcd56cd7b2247ab6dc0d73bbcf940139ae571dc2baa55aa8f4661d4896a7010',
        database: 'd3ud18l4bcu77a',
        ssl: true,
        debug: true
    }
});

function setupDataLayer() {
    console.log("Setting up data layer");
    authorDBConnection(sqlDB);
    bookDBConnection(sqlDB);
    eventDBConnection(sqlDB);
    orderDBConnection(sqlDB);
    cartDBConnection(sqlDB);
    userDBConnection(sqlDB);
    fencingDBConnection(sqlDB);
    return setUpDB();
}

module.exports = {database: sqlDB, setupDataLayer};
