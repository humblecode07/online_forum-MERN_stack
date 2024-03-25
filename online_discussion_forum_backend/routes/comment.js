const express = require('express');
const comment_controller = require('../controllers/commentController');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

/* GET requests for all comments on a certain thread */
router.get('/', comment_controller.comment_get_all);

/* GET requests for comment on a certain thread */
router.get('/:commentId', comment_controller.comment_get_one);

/* POST request for creating a comment on a thread */
router.post('/', checkAuth, comment_controller.comment_create);

/* PATCH request for updating a comment on a thread */
router.patch('/:commentId', comment_controller.comment_update);

/* DELETE request for deleting a comment on a thread */
router.delete('/:commentId', comment_controller.comment_delete);

module.exports = router;