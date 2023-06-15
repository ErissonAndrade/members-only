const Comment = require('../models/comments');
const User = require('../models/users');
const Forum = require('../models/forums')

exports.addComment_get = (req, res, next) => {
    try {
        res.render("addComment_form", { title: "Add Comment" });
    } catch (err) {
        next(err);
    }
};

exports.addComment_forums_post = async (req, res, next) => {
    const newComment = new Comment({
        user: res.locals.currentUser._id,
        title: req.body.title,
        date: new Date(),
        message: req.body.comment
    });

    newComment.save();
    
    await Forum.findByIdAndUpdate(req.params.id, {
        $push: {comments: newComment._id}
    });

    const forum = await Forum.findById(req.params.id);
    console.log(forum)
    res.redirect(forum.url);
};

exports.addComment_home_post = async(req, res, next) => {
    const newComment = new Comment({
        user: res.locals.currentUser._id,
        title: req.body.title,
        date: new Date(),
        message: req.body.comment
    });

    newComment.save();

    await Forum.findOneAndUpdate({ name: "Home" }, {
        $push: {comments: newComment._id}
    });

    res.redirect("/")
};