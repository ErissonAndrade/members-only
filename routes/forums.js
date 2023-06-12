var express = require('express');
var router = express.Router();
const forumsController = require('../controllers/forumsController')

router.get('/:id', forumsController.forums_form_get);

router.post('/:id', forumsController.forums_form_post);

module.exports = router;
