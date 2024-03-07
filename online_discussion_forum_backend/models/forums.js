const mongoose = require('mongoose');
const comments = require('./comments.js');
const threads = require('./threads.js');

const Schema = mongoose.Schema;

const forumsSchema = new Schema({
    forum_name: { type: String, required: true },
});