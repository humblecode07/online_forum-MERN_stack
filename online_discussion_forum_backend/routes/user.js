const express = require('express');
const user_controller = require('../controllers/userController');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

/* GET requests for all users*/
router.get('/', user_controller.user_get);

/* GET request for specific user */
router.get('/:userId', user_controller.user_get_one);

/* POST request user create */
router.post('/', user_controller.user_post_create);

/* POST request user change password*/
router.post('/:userId', user_controller.user_post_changepass);

/* PATCH request user update info*/
router.patch('/:userId', user_controller.user_patch_info)

/* DELETE request user*/
router.delete('/:userId', user_controller.user_delete)

module.exports = router;