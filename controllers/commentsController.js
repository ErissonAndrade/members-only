const { body, validationResult } = require('express-validator');
const Comment = require('../models/comments');
const Forum = require('../models/forums');

const commentsValidator = () => [
  body('title')
    .isLength({ min: 1 })
    .withMessage('Title must not be empty')
    .isLength({ max: 30 })
    .withMessage('Title must not exceed 30 chatacters')
    .trim()
    .escape(),
  body('comment')
    .isLength({ min: 1 })
    .withMessage('Message must not be empty')
    .isLength({ max: 140 })
    .withMessage('Message must not exceed 140 chatacters')
    .trim()
    .escape(),
];

exports.addComment_get = (req, res, next) => {
  try {
    res.render('addComment_form', { title: 'Add Comment' });
  } catch (err) {
    next(err);
  }
};

exports.addComment_forums_post = [
  commentsValidator(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('addComment_form', { title: 'Add Comment', errors: errors.array() });
    }

    const newComment = new Comment({
      user: res.locals.currentUser._id,
      title: req.body.title,
      date: new Date(),
      message: req.body.comment,
    });

    await newComment.save();

    await Forum.findByIdAndUpdate(req.params.id, {
      $push: { comments: newComment._id },
    });

    const forum = await Forum.findById(req.params.id);
    res.redirect(forum.url);
  },
];

exports.addComment_home_post = [
  commentsValidator(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('addComment_form', { title: 'Add Comment', errors: errors.array() });
    }

    const newComment = new Comment({
      user: res.locals.currentUser._id,
      title: req.body.title,
      date: new Date(),
      message: req.body.comment,
    });

    await newComment.save();

    await Forum.findOneAndUpdate({ name: 'Home' }, {
      $push: { comments: newComment._id },
    });

    res.redirect('/');
  },
];

exports.removeComment_get = async (req, res, next) => res.render('removeComment_form', {
  title: 'Are you sure you want to delete this comment?',
  lastPage: req.header('referer'),
});

exports.removeComment_post = async (req, res, next) => {
  try {
    await Comment.findByIdAndRemove(req.params.id);
    const forum = await Forum.findOne({ comments: req.params.id });
    return res.redirect(forum.url);
  } catch (err) {
    next(err);
  }
};
