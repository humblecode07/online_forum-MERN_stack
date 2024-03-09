const User = require('../models/users');
const Forum = require('../models/forums');
const Thread = require('../models/threads');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const asyncHandler = require('express-async-handler');
const forums = require('../models/forums');

// USER ACCOUNT

/* Display all users */
exports.user_get = asyncHandler(async (req, res, next) => {
    const [users, userCount] = await Promise.all([
        User.find().exec(),
        User.countDocuments().exec()
    ]);

    return res.status(201).json({
        userCount,
        users
    });
});

/* Display specific user */
exports.user_get_one = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.find({_id: userId}).exec();

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(201).json({
        user: user
    });
});

/* Create user account*/
exports.user_post_create = asyncHandler(async (req, res, next) => {
    User.find({
        email: req.body.email
      })
      .exec()
      .then(user => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: 'E-mail exist'
          }) // putting an email exist into the signup
        }
        else {
            bcrypt.hash(req.body.pass, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }
                else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        school_id: req.body.school_id,
                        first_name: req.body.first_name,
                        family_name: req.body.family_name,
                        user_name: req.body.user_name,
                        email: req.body.email,
                        pass: hash,
                        bio: req.body.bio,
                        date_of_birth: req.body.date_of_birth,
                        sex: req.body.sex,
                        department: req.body.department,
                        year_level: req.body.year_level,
                        officer: req.body.officer ,
                        role: req.body.role
                    });
                    
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "User created"
                        })
                    })
                }
            })
        }
    }) 
});

/* Change user password*/
exports.user_post_changepass = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    const updatedPass = await User.findByIdAndUpdate({ _id: userId }, { pass: hashPassword }, { new: true })

    if (!updatedPass) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
        message: "Password changed successfully"
    })
});

/* Update user's info*/
exports.user_patch_info = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, {
        $set: req.body
    }, { new: true })

    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
        message: "User info has been updated.",
        user: updatedUser
    })
});

/* Delete user account*/
exports.user_delete = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete({ _id: userId })

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
        message: "User info has been deleted.",
        user: user
    })
})

// FORUMS

/* Display all forums */
exports.forum_get = asyncHandler(async (req, res, next) => {
    const [forums, forumCount] = await Promise.all([
        Forum.find().exec(),
        Forum.countDocuments().exec()
    ]);

    return res.status(201).json({
        forumCount,
        forums
    });
});

/* Display a forum */
exports.forum_get_one = asyncHandler(async (req, res, next) => {
    const { forumId } = req.params;
    const forum = await Forum.find({_id: forumId}).exec();

    if (!forum) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(201).json({
        forum: forum
    });
});

/* Create forum */
exports.forum_create = asyncHandler(async (req, res, next) => {
    const forum = new Forum({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        creator: req.body.creator,
        description: req.body.description,
        creationTime: req.body.creationTime,
        threads: req.body.threads,
        editedAt: req.body.editedAt,
        deletedAt: req.body.deletedAt,
    });

    await forum.save();

    return res.status(200).json({
        message: "Forum " + req.body.name + " has been created",
    })
});

/* Edit forum detail */
exports.forum_patch_info = asyncHandler(async (req, res, next) => {
    const { forumId } = req.params;

    const updatedForum = await Forum.findByIdAndUpdate({ _id: forumId }, {
        $set: req.body, editedAt: Date.now()
    }, { new: true });

    if (!updatedForum) {
        return res.status(404).json({ message: "Forum not found" });
    }

    return res.status(200).json({
        message: "Forum info has been updated.",
        user: updatedForum
    })
});

/* Delete forum */
exports.forum_delete = asyncHandler(async (req, res, next) => {
    const { forumId } = req.params;

    const forum = await Forum.findByIdAndDelete({ _id: forumId })

    // Implement storage for deleted forums.

    if (!forum) {
        return res.status(404).json({ message: "Forum not found" });
    }

    return res.status(200).json({
        message: "Forum info has been deleted.",
        forum: forum
    })
});

// THREADS

/* Get all threads */
exports.thread_get_all = asyncHandler(async (req, res, next) => {
    const [thread, threadCount] = await Promise.all([
        Thread.find().exec(),
        Thread.countDocuments().exec()
    ]);

    return res.status(201).json({
        threadCount,
        thread
    });
});

/* Get all threads in a certain forum */
exports.thread_get_all_forum = asyncHandler(async (req, res, next) => {
    const [thread, threadCount] = await Promise.all([
        Thread.find({ posts: req.params.forumId }).exec(),
        Thread.countDocuments({ posts: req.params.forumId }).exec()
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
        posts: req.params.forumId,
        title: req.body.title,
        content: req.body.content
    });

    await thread.save();

    await Forum.findByIdAndUpdate(req.params.forumId, 
        { $push: { threads: thread._id } }, 
        { new: true }
    );

    return res.status(200).json({
        message: "Thread " + req.body.title + " has been created",
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

// COMMENTS