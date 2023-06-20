const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const UsersSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true, maxLength: '15' },
  password: { type: String, required: true },
  forum_member: [{ type: Schema.Types.ObjectId, required: true }],
  isAdmin: { type: Boolean },
});

UsersSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      next();
    } catch (err) {
      next(err);
    }
  }
});

UsersSchema.virtual('url').get(function () {
  return `${this.id}/add-comment`;
});

module.exports = mongoose.model('Users', UsersSchema);
