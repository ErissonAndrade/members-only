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

    await Forum.findOneAndUpdate({ name: 'Home' }, {
        $push: {comments: newComment._id}
    });

    res.redirect("/")
};

exports.removeComment_get = async(req, res , next) => {
    return res.render('removeComment_form', {
        title: 'Are you sure you want to delete this comment?', 
        lastPage: req.header("referer")
    });
};

exports.removeComment_post = async(req, res , next) => {
    try {
        await Comment.findByIdAndRemove(req.params.id);
        res.redirect(req.header("referer"));
    }
    catch(err) {
        next(err)
    }
};