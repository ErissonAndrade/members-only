const User = require("../models/users");

exports.signUp_get = (req, res, next) => {
    try {
        res.render('signUp_form')
        next();
    }
    catch(err) {
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
        res.redirect("/")
        next();
    }
    catch(err) {
        next(err);
    }
};

exports.signIn_get = (req, res, next) => {
    try {
        res.render('signIn_form')
        next();
    }
    catch(err) {
        next(err);
    }
};

exports.signIn_post = (req, res, next) => {
    try {

        next();
    }
    catch(err) {
        next(err);
    }
}