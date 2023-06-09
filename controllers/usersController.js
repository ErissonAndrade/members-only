const User = require('../models/users');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

exports.signUp_get = async (req, res, next) => {
    try {
        return res.render('signUp_form', { title: "Sign Up" })
    }
    catch (err) {
        next(err);
    }
};

exports.signUp_post = [
    body("firstName", "First name is required").isLength({ min: 1 }).trim().escape(),
    body("lastName", "Last name is required").isLength({ min: 1 }).trim().escape(),
    body("username", "Username is required").isLength({ min: 1 }).trim().escape(),
    body("password", "Password is required").isLength({ min: 1 }).trim().escape(),
    body("confirmPassword", "Passwords do not match").isLength({ min: 1 })
        .custom((value, { req }) => value === req.body.password)
        .trim()
        .escape(),

    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            const username = await User.find({ username: req.body.username });

            if (!errors.isEmpty()) {
                return res.render('signUp_form', { title: "Sign up", errors: errors.array() });
            }

            if (username.length === 0) {
                const newUser = new User({
                    first_name: req.body.firstName,
                    last_name: req.body.lastName,
                    username: req.body.username,
                    password: req.body.password,
                    member_status: 'standard'
                });
                await newUser.save();
                res.redirect('/');
            } else {
                return res.render('signUp_form', { title: "Sign up", username: username });
            }
        }
        catch (err) {
            next(err);
        }
    }
];


exports.signIn_get = [
    body("username").trim().escape(),
    body("password").trim().escape(),

    (req, res, next) => {
        try {
            const errors = validationResult(req);
            const messages = req.session.messages;

            if (!errors.isEmpty()) {
                return res.render('signIn_form', { title: "Sign in", message: messages })
            }

            return res.render('signIn_form', { title: "Sign in", message: messages });
        }
        catch (err) {
            next(err);
        }
    }
]

exports.signIn_post = passport.authenticate('local', {
    failureRedirect: '/sign-in',
    failureMessage: true,
    successRedirect: '/'
});

exports.signOut_get = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        res.redirect("/")
    })
};




