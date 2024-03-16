const express = require('express');
const admin_controller = require('../controllers/adminController');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// USERS

/* GET requests for all users*/
router.get('/users', admin_controller.user_get);

/* GET request for specific user */
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

/* GET requests for all forums */
router.get('/forums', admin_controller.forum_get);

/* GET request for specific forum */
router.get('/forums/:forumId', admin_controller.forum_get_one);

/* POST request forum create */
router.post('/forums', checkAuth, admin_controller.forum_create);

/* PATCH request forum info */
router.patch('/forums/:forumId', admin_controller.forum_patch_info);

/* DELETE request forum */
router.delete('/forums/:forumId', admin_controller.forum_delete);

// THREADS

/* GET request for all threads */
router.get('/threads', admin_controller.thread_get_all);

/* GET request for all threads on a certain forum */
router.get('/forums/:forumId/threads', admin_controller.thread_get_all_forum);

/* GET request for a thread on a certain forum */
router.get('/forums/:forumId/threads/:threadId', admin_controller.thread_get_one_forum);

/* POST request thread create */
router.post('/forums/:forumId/threads', checkAuth, admin_controller.thread_create);

/* PATCH request for a thread */
router.patch('/forums/:forumId/threads/:threadId', admin_controller.thread_update);

/* DELETE request for thread */
router.delete('/forums/:forumId/threads/:threadId', admin_controller.thread_delete);

// COMMENTS

/* GET requests for all comments on a certain thread */
router.get('/forums/:forumId/threads/:threadId/comments', admin_controller.comment_get_all);

/* GET requests for comment on a certain thread */
router.get('/forums/:forumId/threads/:threadId/comments/:commentId', admin_controller.comment_get_one);

/* POST request for creating a comment on a thread */
router.post('/forums/:forumId/threads/:threadId/comments', checkAuth, admin_controller.comment_create);

/* PATCH request for updating a comment on a thread */
router.patch('/forums/:forumId/threads/:threadId/comments/:commentId', admin_controller.comment_update);

/* DELETE request for deleting a comment on a thread */
router.delete('/forums/:forumId/threads/:threadId/comments/:commentId', admin_controller.comment_delete);

module.exports = router;
