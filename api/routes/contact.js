var uuid = require('node-uuid');


module.exports = function(app, authN, db) {
    app.get('/contact', authN, function (req, res) {
        db.collection('contacts').find({}, { firstName: 1, lastName: 1, email: 1, uid: 1 }).toArray(function (err, result) {
            if (err) {
                return console.log(err)
            }
            res.json(result);
        });
    });

    app.get('/contact/:id', authN, function (req, res) {
        var id = req.params.id;
        //TODO: may want to change to findOne() since we are only expecting 1 result returned
        db.collection('contacts').find({uid: id},
            { firstName: 1, lastName: 1, email: 1, uid: 1 }).toArray(function (err, result) {
            if (err) {
                return console.log(err)
            }
            res.json(result);
        });
    });

    //Register a new contact
    app.post('/contact', authN, function (req, res) {
        //TODO: Need some sort of role/privilege check
        // var decoded = jwt.decode(req.token, {json: true, complete: true});
        // if (decoded.payload.data.role && decoded.payload.data.role === 'admin') {
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
    app.put('/contact', authN, function (req, res) {
        //TODO: Need some sort of role/privilege check
        // var decoded = jwt.decode(req.token, {json: true, complete: true});
        // if (decoded.payload.data.role && decoded.payload.data.role === 'admin') {
        var updatedUser = req.body;
        db.collection('contacts').findOne({uid: updatedUser.uid}, function (err, user) {
            if (err) {
                return console.log(err)
            } else {
                if (user) {
                    user.firstName = updatedUser.firstName;
                    user.lastName = updatedUser.lastName;
                    user.email = updatedUser.email;
                    if(updatedUser.updatePassword){
                        console.log('Updating password');
                        user.password = bcrypt.hashSync(updatedUser.password, WORK_FACTOR);
                    }
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
        //     //user not an Admin , so can not create contacts.
        //     res.json({error: "Insufficient privileges to Create new contacts."});
        // }
    });

    //Delete single contact
    app.delete('/contact/:id', authN, function (req, res) {
        // var decoded = jwt.decode(req.token, {json: true, complete: true});
        // if (decoded.payload.data.role && decoded.payload.data.role === 'admin' ) {
            var id = req.params.id;
            db.collection('contacts').remove({uid: id}, function (err, result) {
                if (err) {
                    return console.log(err)
                }
                res.json(result);
            });
        // } else {
        //     res.json({error: "Insufficient privileges to Delete Contacts."});
        // }
    });

    //Delete an array of contacts by uid
    app.delete('/contact', authN, function (req, res) {
        // var decoded = jwt.decode(req.token, {json: true, complete: true});
        // if (decoded.payload.data.role && decoded.payload.data.role === 'admin' ) {
        db.collection('contacts').remove({uid: {$in: req.body}}, function (err, result) {
            if (err) {
                return console.log(err)
            }
            res.json(result);
        });
        // } else {
        //     res.json({error: "Insufficient privileges to Delete Contacts."});
        // }
    });



    return app;
};
