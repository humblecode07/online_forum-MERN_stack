const mongoose = require('mongoose');
const comments = require('./comments.js')

const Schema = mongoose.Schema;

const threadsSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    username: { type: String, required: true },
    // profilePicture: { type: String, required: true },
    posts: { type: mongoose.Schema.Types.ObjectId, ref: 'Forums', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now},
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    viewCount: { type: Number, default: 0 },
    replyCount: { type: Number, default: 0 },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    edited: { type: Boolean, default: false },
    editedAt: { type: Date },
    deletedAt: { type: Date },
    pinned: { type: Boolean, default: false }
});

module.exports = mongoose.model("Threads", threadsSchema);