const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const { Schema } = mongoose;

const CommentsSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  title: { type: String },
  date: { type: Date, required: true },
  message: { type: String, required: true },
});

CommentsSchema.virtual('date_formatted').get(function () {
  const dateFormatted = DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
  const timeFormatted = DateTime.fromJSDate(this.date).toLocaleString(DateTime.TIME_SIMPLE);
  return `${dateFormatted} ${timeFormatted}`;
});

CommentsSchema.virtual('remove_comment').get(function () {
  return `/${this.id}/remove-comment`;
});

module.exports = mongoose.model('Comments', CommentsSchema);
