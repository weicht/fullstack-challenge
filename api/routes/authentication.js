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

    //Authenticate a login attempt
    app.post('/authenticate', function (req, res) {
        console.log(req.body);
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
                            var token = jwt.sign({
                                data: authUser
                            }, SECRET, {expiresIn: '1d'});
                            res.json({token: token});
                        }
                    });

                } else {
                    res.json({error: "User not found"});
                }
            }
        });
    });

    //Register a new contact
    app.post('/register', authN, function (req, res) {
        var decoded = jwt.decode(req.token, {json: true, complete: true});
        //TODO: Need some sort of role/privilege check
        // if (decoded.payload.data.role && (decoded.payload.data.role === 'admin' || decoded.payload.data.role === 'instructor')) {
            bcrypt.hash(req.body.password, WORK_FACTOR, function (err, hash) {
                if (err) {
                    return console.log(err)
                }

                var newUser = {
                    firstName: req.body.firstName ? req.body.firstName : '',
                    lastName: req.body.lastName ? req.body.lastName : '',
                    password: hash,
                    email: req.body.email ? req.body.email : '',
//                    role: req.body.role ? req.body.role : '',
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
                                    email: result.ops[0].email,
//                                    role: result.ops[0].role
                                };
                                res.json(authUser);
                            });
                        }
                    }
                });
            });

        // } else {
        //     //user not an Admin nor Instructor, so can not create users.
        //     res.json({error: "Insufficient privileges to Register new users."});
        // }
    });


    //Update an existing contact
    app.put('/register', authN, function (req, res) {
        //TODO: Need some sort of role/privilege check
        var decoded = jwt.decode(req.token, {json: true, complete: true});
        // if (decoded.payload.data.role && (decoded.payload.data.role === 'admin' || decoded.payload.data.role === 'instructor')) {
            var updatedUser = req.body;
            db.collection('contacts').findOne({uid: updatedUser.uid}, function (err, user) {
                if (err) {
                    return console.log(err)
                } else {
                    if (user) {
                        user.firstName = updatedUser.firstName;
                        user.lastName = updatedUser.lastName;
                        user.email = updatedUser.email;
                        // if(updatedUser.updatePassword){
                        //     console.log('Updating password');
                        //     user.password = bcrypt.hashSync(updatedUser.password, WORK_FACTOR);
                        // }
                        db.collection('contacts').save(user, function (err, result) {
                            if (err) {
                                return console.log(err)
                            }
                            res.json(user);
                        });
                    } else {
                        //not found
                        res.json({error: "User not found."});
                    }
                }
            });

        // } else {
        //     //user not an Admin nor Instructor, so can not create users.
        //     res.json({error: "Insufficient privileges to Register new users."});
        // }
    });

    return app;
};
