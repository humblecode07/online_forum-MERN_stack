const express = require('express');
const admin_controller = require('../controllers/adminController');

const router = express.Router();

/* GET request of all users*/
router.get('/users', admin_controller.user_get);

/* POST request user create */
router.post('/users', admin_controller.user_post_create);

/* POST request user change password*/
router.post('/users/:userId', admin_controller.user_post_changepass);

/* PATCH request user update info*/
router.patch('/users/:userId', admin_controller.user_patch_info)

/* DELETE request user*/
router.delete('/users/:userId', admin_controller.user_delete)

module.exports = router;
