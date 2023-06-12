var express = require('express');
var router = express.Router();
const forumsController = require('../controllers/forumsController')

router.get('/cats', (req, res, next) => {
  res.render('forums', {title: "Cats Forum"})
});

router.get('/dogs', (req, res, next) => {
  res.render('forums', {title: "Dogs Forum"})
});

router.get('/lizards', (req, res, next) => {
  res.render('forums', {title: "Lizards Forum"})
});

router.get('/snakes', (req, res, next) => {
  res.render('forums', {title: "Snakes Forum"})
});

module.exports = router;
