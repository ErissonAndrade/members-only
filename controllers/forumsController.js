const User = require('../models/users');
const Forums = require('../models/forums')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

exports.forums_form_get = async (req, res, next) => {
    if(res.locals.currentUser) {
        if(res.locals.currentUser.forum_member.includes(req.params.id)) {
            const forum = await Forums.findById(req.params.id);
            return res.render("forums", {title: forum.fullName, forumAddComment: forum.add_comment_url});
        };
    }
    return res.render('forums_form', { title: "You do do not have permission to access this forum!" })
};

exports.forums_form_post = [
    body('password').trim().escape(),

    async (req, res, next) => {
        try {
            const forum = await Forums.findById(req.params.id).populate({ path: "comments", populate: { path:"user" } });
            bcrypt.compare(req.body.password, forum.password, async (err, result) => {
                try {
                    if (err) {
                        console.error(err)
                        return
                    }
                    if (result) {
                        await User.findByIdAndUpdate(res.locals.currentUser.id, {
                            $addToSet: {forum_member: forum._id}
                        });
                        res.redirect(forum.url);
                        return res.render("forums", { title: forum.fullName, comments: forum.comments });
                    }
                    else {
                        return res.render("forums_form", {title: "You do not have permission to access this forum!", error: "Incorrect Password"})
                    }
                } catch(err) {
                    console.error(err)
                }
            })
        } catch (err) {
            next(err)
        }
    }
]