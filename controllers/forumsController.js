const User = require('../models/users');
const Forums = require('../models/forums')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

exports.forums_form_get = async (req, res, next) => {
    return res.render('forums_form', { title: "You do do not have permission to access this forum!" })
};

exports.forums_form_post = [
    body('password').trim().escape(),

    async (req, res, next) => {
        try {
            const forum = await Forums.findById(req.params.id).populate("comments");
            bcrypt.compare(req.body.password, forum.password, (err, result) => {
                if (err) {
                    console.error(err)
                    return
                }
                if (result) {
                    User.findByIdAndUpdate(res.locals.currentUser.id, {
                        $addToSet: {member_status: forum.name}
                    });

                    return res.render("forums", {title: `${forum.name} Forum`})
                }
                else {
                    return res.render("forums_form", {title: "You do do not have permission to access this forum!"     , error: "Incorrect Password"})
                }
            })
        } catch (err) {
            next(err)
        }
    }
]