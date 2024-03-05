const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const forumsSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    username: { type: String, required: true },
    profilePicture: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now},
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replyCount: { type: Number, default: 0 },
    replies: [{}],
    edited: { type: Boolean, default: false },
    editedAt: { type: Date },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
});

module.exports = mongoose.model("Forums", forumsSchema);