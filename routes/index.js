var express = require('express');
var router = express.Router();
const userController = require('../controllers/usersController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sign-up', userController.signUp_get);
router.post('/sign-up', userController.signUp_post);

router.get('/sign-in', userController.signIn_get);
router.post('/sign-in', userController.signIn_post);

module.exports = router;
