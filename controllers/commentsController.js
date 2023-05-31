const Comment = require('../models/comments');
const User = require('../models/users');

exports.addComment_get = (req, res, next) => {
    try {
        res.render("addComment_form");
    } catch (err) {
        next(err);
    }
};

exports.addComment_post = async (req, res, next) => {
    const newComment = await new Comment({
        user: res.locals.currentUser._id,
        title: req.body.title,
        date: new Date(),
        message: req.body.comment
    });
    await newComment.save();
    res.redirect("/")
};