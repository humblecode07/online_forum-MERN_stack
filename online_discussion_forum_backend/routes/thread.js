const express = require('express');
const thread_controller = require('../controllers/threadController');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

/* GET request for all threads on a certain forum */
router.get('/', thread_controller.thread_get_all_forum);

/* GET request for a thread on a certain forum */
router.get('/:threadId', thread_controller.thread_get_one_forum);

/* POST request thread create */
router.post('/', checkAuth, thread_controller.thread_create);

/* PATCH request for a thread */
router.patch('/:threadId', thread_controller.thread_update);

/* DELETE request for thread */
router.delete('/:threadId', thread_controller.thread_delete);

module.exports = router;