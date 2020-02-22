const sqlDbFactory = require("knex");

let {authorDBConnection} = require("./AuthorService");
let {bookDBConnection} = require("./BookService");
let {eventDBConnection} = require("./EventService");
let {orderDBConnection} = require("./OrderService");
let {cartDBConnection} = require("./ShoppingCartService");
let {userDBConnection} = require("./UserService");

function setUpDB() {
    return new Promise(function (resolve, reject) {
        resolve();
    });
}


let sqlDB = sqlDbFactory({
    client: 'pg',
    version: '11.2',
    connection: {
        host: 'ec2-54-247-72-30.eu-west-1.compute.amazonaws.com',
        user: 'rdwqtacglidfpe',
        password: '19ac00291a7b0f30d32c79984c9137320c6eb0a5a933a4853178a8717b9a810c',
        database: 'd6eql75gt59i6f',
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
    return setUpDB();
}

module.exports = {database: sqlDB, setupDataLayer};
