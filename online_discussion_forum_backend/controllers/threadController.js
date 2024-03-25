const User = require('../models/users');
const Forum = require('../models/forums');
const Thread = require('../models/threads');
const mongoose = require('mongoose');

const asyncHandler = require('express-async-handler');

/* Get all threads in a certain forum */
exports.thread_get_all_forum = asyncHandler(async (req, res, next) => {
    const [thread, threadCount] = await Promise.all([
        Thread.find({ forumPost: req.params.forumId }).exec(),
        Thread.countDocuments({ forumPost: req.params.forumId }).exec()
    ]);

    return res.status(201).json({
        threadCount,
        thread
    });
});

/* Get a thread in a certain forum */
exports.thread_get_one_forum = asyncHandler(async (req, res, next) => {
    const thread = await Thread.findById({ _id: req.params.threadId }).exec()

    return res.status(201).json({
        thread
    });
});

/* Create a thread */
exports.thread_create = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.userData.userId);

    const thread = new Thread({
        _id: new mongoose.Types.ObjectId(),
        user: user._id,
        username: user.user_name,
        forumPost: req.params.forumId,
        title: req.body.title,
        content: req.body.content
    });

    await thread.save();

    await Forum.findByIdAndUpdate(req.params.forumId, 
        { $push: { threads: thread._id } }, 
        { new: true }
    );

    return res.status(200).json({
        message: "Thread, " + req.body.title + ", has been created",
    })
});

/* Update a thread */
exports.thread_update = asyncHandler(async (req, res, next) => {
    const threadId = req.params.threadId;
    console.log(threadId)
    const updatedThread = await Thread.findByIdAndUpdate(threadId, {
        $set: req.body, editedAt: Date.now()
    }, { new: true });

    if (!updatedThread) {
        return res.status(404).json({ message: "Thread not found" });
    }

    return res.status(200).json({
        message: "Thread info has been updated.",
        user: updatedThread
    })
});

/* Delete a thread */
exports.thread_delete = asyncHandler(async (req, res, next) => {
    const threadId = req.params.threadId;
    const forumId = req.params.forumId;

    const thread = await Thread.findByIdAndDelete(threadId);

    await Forum.findByIdAndUpdate(forumId, 
        { $pull: { threads: threadId } },
        { new: true }
    );

    // Implement storage for deleted forums.

    if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
    }

    return res.status(200).json({
        message: "Thread info has been deleted.",
        thread: thread
    })
});