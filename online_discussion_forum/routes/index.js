const express = require('express');
const index_controller = require('../controllers/indexController');

const router = express.Router();

/* GET home page. */
router.get('/', index_controller.home_page);

/* GET login page*/ 
router.get('/login', index_controller.log_in_page);

/* POST login page*/ 
router.post('/login', index_controller.log_in);

module.exports = router;
