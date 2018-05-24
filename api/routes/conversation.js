var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
const WORK_FACTOR = 10;


module.exports = function(app, authN, db) {
    app.get('/conversation', authN, function (req, res) {
        db.collection('conversations').find({}, { subject: 1, recipients: 1, lastUpdated: 1, messages: 1, uid: 1 }).toArray(function (err, result) {
            if (err) {
                return console.log(err)
            }
            res.json(result);
        });
    });

    app.get('/conversation/:id', authN, function (req, res) {
        var id = req.params.id;
        //TODO: may want to change to findOne() since we are only expecting 1 result returned
        db.collection('conversations').find({uid: id},
            { subject: 1, recipients: 1, lastUpdated: 1, messages: 1, uid: 1 }).toArray(function (err, result) {
            if (err) {
                return console.log(err)
            }
            res.json(result);
        });
    });

    //Register a new conversation
    app.post('/conversation', authN, function (req, res) {
        //TODO: Need some sort of role/privilege check
        // var decoded = jwt.decode(req.token, {json: true, complete: true});
        // if (decoded.payload.data.role && decoded.payload.data.role === 'admin') {
        // bcrypt.hash(req.body.password, WORK_FACTOR, function (err, hash) {
        //     if (err) {
        //         return console.log(err)
        //     }

            var newConversation = {
                subject: req.body.subject ? req.body.subject : '',
                lastUpdated: 'need timestamp',
                messages: req.body.messages ? req.body.messages : [],
                recipients: req.body.recipients ? req.body.recipients : [],
                uid: String(uuid())
            };

//             db.collection('conversations').findOne({email: newUser.email}, function (err, user) {
//                 if (err) {
//                     return console.log(err)
//                 } else {
//                     if (user) {
//                         //error as this user exists already
// //                        res.json({error: "User exists already"});
//                         res.status(409).send('User exists already');
//                     } else {
//                         //not found so add them...
                        db.collection('conversations').insertOne(newConversation, function (err, result) {
                            if (err) {
                                return console.log(err)
                            }
                            var conversation = {
                                uid: result.ops[0].uid,
                                subject: result.ops[0].subject,
                                lastUpdated: result.ops[0].lastUpdated,
                                messages: result.ops[0].messages,
                                recipients: result.ops[0].recipients
                            };
                            res.json(conversation);
                        });
            //         }
            //     }
            // });

//        });

        // } else {
        //     //user not an Admin nor Instructor, so can not create users.
        //     res.json({error: "Insufficient privileges to Register new users."});
        // }
    });


    //Update an existing conversation
    app.put('/conversation', authN, function (req, res) {
        //TODO: Need some sort of role/privilege check
        // var decoded = jwt.decode(req.token, {json: true, complete: true});
        // if (decoded.payload.data.role && decoded.payload.data.role === 'admin') {
        var updatedConversation = req.body;
        db.collection('conversations').findOne({uid: updatedConversation.uid}, function (err, conversation) {
            if (err) {
                return console.log(err)
            } else {
                if (conversation) {
                    conversation.subject = updatedConversation.subject;
                    conversation.lastUpdated = updatedConversation.lastUpdated;
                    conversation.messages = updatedConversation.messages;
                    conversation.recipients = updatedConversation.recipients;
                    db.collection('conversations').save(conversation, function (err, result) {
                        if (err) {
                            return console.log(err)
                        }
                        res.json(user);
                    });
                } else {
                    //not found
                    res.json({error: "conversation not found."});
                }
            }
        });

        // } else {
        //     //user not an Admin , so can not create conversations.
        //     res.json({error: "Insufficient privileges to Create new conversations."});
        // }
    });

    //Delete single conversation
    app.delete('/conversation/:id', authN, function (req, res) {
        // var decoded = jwt.decode(req.token, {json: true, complete: true});
        // if (decoded.payload.data.role && decoded.payload.data.role === 'admin' ) {
        var id = req.params.id;
        db.collection('conversations').remove({uid: id}, function (err, result) {
            if (err) {
                return console.log(err)
            }
            res.json(result);
        });
        // } else {
        //     res.json({error: "Insufficient privileges to Delete conversations."});
        // }
    });

    //Delete an array of conversations by uid
    app.delete('/conversation', authN, function (req, res) {
        // var decoded = jwt.decode(req.token, {json: true, complete: true});
        // if (decoded.payload.data.role && decoded.payload.data.role === 'admin' ) {
        db.collection('conversations').remove({uid: {$in: req.body}}, function (err, result) {
            if (err) {
                return console.log(err)
            }
            res.json(result);
        });
        // } else {
        //     res.json({error: "Insufficient privileges to Delete conversations."});
        // }
    });



    return app;
};
