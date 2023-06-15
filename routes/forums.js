var express = require('express');
var router = express.Router();
const forumsController = require('../controllers/forumsController');
const commentsController = require('../controllers/commentsController');

router.get('/:id', forumsController.forums_form_get);
router.post('/:id', forumsController.forums_form_post);

router.get('/:id/add-comment', commentsController.addComment_get);
router.post('/:id/add-comment', commentsController.addComment_forums_post);



module.exports = router;
