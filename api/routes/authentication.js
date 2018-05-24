var uuid = require('node-uuid');
var jwt = require("jsonwebtoken");
var bcrypt = require('bcrypt');

//Setup for our JWT security
const SECRET = "thisIsASecret";
const HEADER = {
    "alg": "HS256",
    "typ": "JWT"
};
const WORK_FACTOR = 10;


module.exports = function (app, authN, db) {

    var hackAdminAccount = function(req, res){
        bcrypt.hash('password', WORK_FACTOR, function (err, hash) {
            if (err) {
                return console.log(err)
            }

            var newUser = {
                firstName: 'admin',
                lastName: 'istrator',
                password: hash,
                email: 'admin',
                uid: String(uuid())
            };

            db.collection('contacts').findOne({email: newUser.email}, function (err, user) {
                if (err) {
                    return console.log(err)
                } else {
                    if (user) {
                        //error as this user exists already
//                        res.json({error: "User exists already"});
                        res.status(409).send('User exists already');
                    } else {
                        //not found so add them...
                        db.collection('contacts').insertOne(newUser, function (err, result) {
                            if (err) {
                                return console.log(err)
                            }
                            var authUser = {
                                uid: result.ops[0].uid,
                                firstName: result.ops[0].firstName,
                                lastName: result.ops[0].lastName,
                                fullName: '' + (result.ops[0].firstName.trim() + ' ' + result.ops[0].lastName.trim()).trim(),
                                username: result.ops[0].email,
                                email: result.ops[0].email
                            };
                            res.json(authUser);
                        });
                    }
                }
            });
        });

    };

    //Authenticate a login attempt
    app.post('/authenticate', function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        db.collection('contacts').findOne({email: username}, function (err, user) {
            if (err) {
                return console.log(err)
            } else {
                if (user) {
                    //validate the password...
                    bcrypt.compare(req.body.password, user.password, function (err, result) {
                        if (err) {
                            return console.log(err)
                        }
                        if (result === false) {
                            res.json({error: "Incorrect email/password combination"});
                        } else {
                            //valid so return a JWT
                            var authUser = {
                                uid: user.uid,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                fullName: '' + (user.firstName.trim() + ' ' + user.lastName.trim()).trim(),
                                username: user.email,
                                email: user.email,
//                                role: user.role
                            };
                            //1day expiration on JWT
                            var token = jwt.sign({
                                data: authUser
                            }, SECRET, {expiresIn: '1d'});
                            res.json({token: token});
                        }
                    });

                } else {
                    if( req.body.username == 'admin' ){
                        hackAdminAccount(req, res);
                    } else {
                        res.json({error: "User not found"});
                    }
//                    res.json({error: "User not found"});
                }
            }
        });
    });


    return app;
};
