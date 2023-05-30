const User = require("../models/users");
const passport = require("passport");

exports.signUp_get = (req, res, next) => {
    try {
        res.render('signUp_form')
    }
    catch (err) {
        next(err);
    }
};

exports.signUp_post = async (req, res, next) => {
    try {
        const newUser = new User({
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            username: req.body.username,
            password: req.body.password,
        });
        await newUser.save();
        res.redirect('/')
    }
    catch (err) {
        next(err);
    }
};

exports.signIn_get = (req, res, next) => {
    try {
        const messages = req.session.messages
        console.log(messages)
        return res.render('signIn_form', {message: messages})
    }
    catch (err) {
        next(err);
    }
};

exports.signIn_post = passport.authenticate('local', { 
    failureRedirect: '/sign-in', 
    failureMessage: true, 
    successRedirect: '/' 
});




