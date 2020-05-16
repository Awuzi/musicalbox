const express = require('express');
const router = express.Router();
const Account = require('../models/account');

/* GET users listing. */
router.post('/', async (req, res, next) => {
    await Account.find({}, (error, users) => {
        users.forEach((user) => {
            if (user.passe === req.body.password && user.login === req.body.username) {
                Account.find({}, (error, users) => {
                    users.forEach((user) => {
                        users.push(user);
                    });
                    res.render('users', {
                        title: 'MusicalBox',
                        users: users,
                    });
                });
            } else {
                res.render('index', {
                    message: 'Vous n\'êtes pas administrateur',
                });
            }
        });
    });
});

module.exports = router;

