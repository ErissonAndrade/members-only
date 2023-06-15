const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

const ForumsSchema = new Schema({
    name: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comments"}],
    password: { type: String, required: true }
});

ForumsSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
            next();
        }
        catch (err) {
            next(err);
        }
    }
});

ForumsSchema.virtual("url").get(function() {
    return `/forums/${this.id}`
});

ForumsSchema.virtual("fullName").get(function() {
    return `${this.name} Forum`
});

ForumsSchema.virtual("add_comment_url").get(function() {
    return `/forums/${this.id}/add-comment`
});

module.exports = mongoose.model("Forums", ForumsSchema);