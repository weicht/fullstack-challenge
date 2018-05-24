const express = require('express');
const bodyParser= require('body-parser');
const cors = require('express-cors');
const app = express();
const MongoClient = require('mongodb').MongoClient;

//require our custom routes
const contact = require('./routes/contact');
const conversation = require('./routes/conversation');
const authentication = require('./routes/authentication');

const hostname = 'localhost';
const port = process.env.NODE_PORT || 4000;
const MONGO_URL = 'mongodb://localhost/g3';
//const SECRET = "thisIsASecret";


//Need these for posting form data and if you want images of a big size
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});


//Function to ensure the JWT passed in is valid
var ensureAuthN = function(req, res, next){
   next();
   /*
        //TODO: verify token password against db
        // expiry date is handled by jwt.verify()
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            try {
                var bearer = bearerHeader.split(" ");
                jwt.verify(bearer[1], SECRET, function(err, decoded){
                    if(err){
                        console.log('Failed to verify jwt - Forbidden access.');
                        console.log(err);
                        res.sendStatus(403);
                    } else {
                        req.token = bearer[1];
                        //move on to the actual route from here
                        next();
                    }
                });
            } catch(err) {
                // err
                console.log('Failed to verify jwt - Forbidden access.');
                console.log(err);
                res.sendStatus(403);
            }
        } else {
            console.log('No Authorization Bearer JWT found');
            res.sendStatus(403);
    //        next();
        }
    */
};


MongoClient.connect(MONGO_URL, function (err, database) {
    if (err) {
        console.log('Failed to connect to Mongo, so not starting the API Server');
        console.error('Failed to connect to Mongo, so not starting the API Server');
        return console.log(err)
    }

    //Connect our custom routes here
    authentication(app, ensureAuthN, database);
    contact(app, ensureAuthN, database);
    conversation(app, ensureAuthN, database);

    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });

    app.listen(port, hostname, function () {
        console.log('listening on ' + hostname + ':' + port);
    });
});

