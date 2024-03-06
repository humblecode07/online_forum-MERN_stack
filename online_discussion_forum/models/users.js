const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accountSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    school_id: { type: Number, required: true, unique: true },
    first_name: { type: String, required: true, maxLength: 100},
    family_name: { type: String, required: true, maxLength: 100},
    user_name: { type: String, required: true, maxLength: 50 },
    email: { type: String, required: true, unique: true, match: /^[a-zA-Z0-9._%+-]+@dyci\.edu\.ph$/ },
    pass: { type: String, required: true, maxLength: 50 },
    bio: { type: String, maxLength: 100 },
    date_of_birth: { type: Date },
    sex: { type: Date },
    department: { type: String }
});

module.exports = mongoose.model("Users", accountSchema)

