const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
    username: { type: Schema.Types.ObjectId, ref: "Users", required: true},
    title: {type: String},
    date: {type: Date, required: true},
    message: {type: String, required: true}
})

module.exports = mongoose.model("Comments", CommentsSchema);