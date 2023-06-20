const express = require('express');

const router = express.Router();

const forumsController = require('../controllers/forumsController');
const commentsController = require('../controllers/commentsController');

router.get('/:id', forumsController.forums_form_get);
router.post('/:id', forumsController.forums_form_post);

router.get('/:id/add-comment', commentsController.addComment_get);
router.post('/:id/add-comment', commentsController.addComment_forums_post);

router.get('/:id/remove-comment', commentsController.removeComment_get);
router.post('/:id/remove-comment', commentsController.removeComment_post);

module.exports = router;
