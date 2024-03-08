const mongoose = require('mongoose');
const comments = require('./comments.js');
const threads = require('./threads.js');

const Schema = mongoose.Schema;

const forumsSchema = new Schema({
    name: { type: String, required: true },
    creator: { type: String, required: true },
    description: { type: String, required: true },
    creationTime: { type: Date, default: Date.now },
    threads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Threads' }],
    editedAt: { type: Date },
    deletedAt: { type: Date },
});

module.exports = mongoose.model("Forums", forumsSchema)