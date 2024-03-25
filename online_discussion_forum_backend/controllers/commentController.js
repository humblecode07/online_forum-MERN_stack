const User = require('../models/users');
const Thread = require('../models/threads');
const Comment = require('../models/comments');
const mongoose = require('mongoose');

const asyncHandler = require('express-async-handler');

/* Get all comments on a certain thread */
exports.comment_get_all = asyncHandler(async (req, res, next) => {
    const threadId = req.threadId; 

    const thread = await Thread.findById(threadId).exec();

    if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
    }
    const comments = await Comment.find({ threadPost: threadId }).exec();
    const commentCount = comments.length;

    

    return res.status(200).json({ comments, commentCount });
});

/* Get certain comment on a certain thread */
exports.comment_get_one = asyncHandler(async (req, res, next) => {
    const commentId = req.params.commentId;

    const comment = await Comment.findById(commentId).exec();

    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }
    const comments = await Comment.find({ _id: commentId }).exec();

    return res.status(200).json({ comment });
});

/* Create a comment on a certain thread */
exports.comment_create = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.userData.userId);

    const comment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        user: user._id,
        username: user.user_name,
        forumPost: req.params.forumId,
        threadPost: req.threadId,
        content: req.body.content
    });

    await comment.save();

    await Thread.findByIdAndUpdate(req.threadId, 
        { 
            $push: { comments: comment._id }, 
            $inc: { commentCount: 1}
        }, 
        { new: true }
    );

    return res.status(200).json({
        message: "Comment has been created",
    })
});

/* Update a comment on a certain thread */
exports.comment_update = asyncHandler(async (req, res, next) => {
    const commentId = req.params.commentId;

    const updatedComment = await Comment.findByIdAndUpdate(commentId, {
        $set: req.body, editedAt: Date.now()
    }, { new: true });

    if (!updatedComment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json({
        message: "Comment has been updated.",
        user: updatedComment
    })
});

/* Delete a comment on a certain thread */
exports.comment_delete = asyncHandler(async (req, res, next) => {
    const threadId = req.threadId;
    const commentId = req.params.commentId;

    const comment = await Comment.findByIdAndDelete(commentId);

    await Thread.findByIdAndUpdate(threadId, 
        { $pull: { replies: commentId }, $inc: { replyCount: -1 } },
        { new: true }
    );

    // Implement storage for deleted comments.

    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json({
        message: "Comment has been deleted.",
        comment: comment
    })
});