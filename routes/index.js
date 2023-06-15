var express = require('express');
var router = express.Router();
const userController = require('../controllers/usersController');
const commentsController = require('../controllers/commentsController');
const Comments = require('../models/comments');
const Forums = require('../models/forums')

/* GET home page. */
router.get('/', async function (req, res, next) {
  const homeForum = await Forums.findOne({name: "Home"}).populate({ path: "comments", populate: { path:"user" } });
  res.render('index', { title: 'Members Only App', comments: homeForum.comments});
});

router.get('/sign-up', userController.signUp_get);
router.post('/sign-up', userController.signUp_post);

router.get('/sign-in', userController.signIn_get);
router.post('/sign-in', userController.signIn_post);

router.get('/:id/add-comment', commentsController.addComment_get);
router.post('/:id/add-comment', commentsController.addComment_home_post);

router.get('/sign-out', userController.signOut_get);

module.exports = router;
