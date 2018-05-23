var uuid = require('node-uuid');


module.exports = function(app, authN, db) {
    app.get('/contact', authN, function (req, res) {
        db.collection('contacts').find({ firstName: 1, lastName: 1, email: 1, uid: 1 }).toArray(function (err, result) {
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

    // app.delete('/contact/:id', authN, function (req, res) {
    //     var decoded = jwt.decode(req.token, {json: true, complete: true});
    //     if (decoded.payload.data.role && decoded.payload.data.role === 'admin' ) {
    //         var id = req.params.id;
    //         db.collection('users').remove({$and: [{role: 'instructor'}, {uid: id}]}, function (err, result) {
    //             if (err) {
    //                 return console.log(err)
    //             }
    //             res.json(result);
    //         });
    //     } else {
    //         res.json({error: "Insufficient privileges to Delete Instructors."});
    //     }
    // });
    //
    // app.delete('/contact', authN, function (req, res) {
    //     var decoded = jwt.decode(req.token, {json: true, complete: true});
    //     if (decoded.payload.data.role && decoded.payload.data.role === 'admin' ) {
    //         db.collection('users').remove({$and: [{role: 'instructor'}, {uid: {$in: req.body}}]}, function (err, result) {
    //             if (err) {
    //                 return console.log(err)
    //             }
    //             res.json(result);
    //         });
    //     } else {
    //         res.json({error: "Insufficient privileges to Delete Instructors."});
    //     }
    // });

    return app;
};
