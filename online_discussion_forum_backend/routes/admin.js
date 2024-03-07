const express = require('express');
const admin_controller = require('../controllers/adminController');

const router = express.Router();

/* GET request */

/* POST request user create */
router.post('/user', admin_controller.user_create_post);

module.exports = router;
