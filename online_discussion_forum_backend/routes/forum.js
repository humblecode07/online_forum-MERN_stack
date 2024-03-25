const express = require('express');
const forum_controller = require('../controllers/forumController');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

/* GET requests for all forums */
router.get('/', forum_controller.forum_get);

/* GET request for specific forum */
router.get('/:forumId', forum_controller.forum_get_one);

/* POST request forum create */
router.post('/', checkAuth, forum_controller.forum_create);

/* PATCH request forum info */
router.patch('/:forumId', forum_controller.forum_patch_info);

/* DELETE request forum */
router.delete('/:forumId', forum_controller.forum_delete);

module.exports = router;