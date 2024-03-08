const express = require('express');
const admin_controller = require('../controllers/adminController');

const router = express.Router();

// USERS

/* GET request of all users*/
router.get('/users', admin_controller.user_get);

/* GET request of specific user */
router.get('/users/:userId', admin_controller.user_get_one);

/* POST request user create */
router.post('/users', admin_controller.user_post_create);

/* POST request user change password*/
router.post('/users/:userId', admin_controller.user_post_changepass);

/* PATCH request user update info*/
router.patch('/users/:userId', admin_controller.user_patch_info)

/* DELETE request user*/
router.delete('/users/:userId', admin_controller.user_delete)

// FORUMS 

/* GET request of all forums */
router.get('/forums', admin_controller.forum_get);

/* GET request of specific forum */
router.get('/forums/:forumId', admin_controller.forum_get_one);

/* POST request forum create */
router.post('/forums', admin_controller.forum_create);

/* PATCH request forum info */
router.patch('/forums/:forumId', admin_controller.forum_patch_info);

/* DELETE request forum */
router.delete('/forums/:forumId', admin_controller.forum_delete);

module.exports = router;
