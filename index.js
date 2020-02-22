'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http');


//let { setupDataLayer } = require("./service/DataLayer");
// EXPRESS

var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use('/backend', express.static('backend'));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var auth = require("./auth");


// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
//    res.render( "index.html", { user: req.user });
    res.sendFile("index.html");
});

var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var serverPort = 8080;
//const LosslessJSON = require('lossless-json');

//DATALAYER

let {setupDataLayer} = require("./service/DataLayer");

// swaggerRouter configuration
var options = {
    swaggerUi: path.join(__dirname, '/swagger.json'),
    controllers: path.join(__dirname, './controllers'),
    useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

var swaggerUIOptions = {
    swaggerUi: '/backend/swaggerui',
    apiDocs: '/backend/spec'
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname, 'backend/spec.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());

    // Validate Swagger requests
    app.use(middleware.swaggerValidator());

    //manage token function in the 'auth' module //JWT
    app.use(middleware.swaggerSecurity({
        api_key: auth.verifyToken
    }));

    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options));

    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi(swaggerUIOptions));

    //DATALAYER

    // Start the server
    setupDataLayer().then(() => {
        http.createServer(app).listen(process.env.PORT || serverPort, function () {
            console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
            console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
        });
    });
});





