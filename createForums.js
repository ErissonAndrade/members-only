const mongoose = require("mongoose");
const Forum = require('./models/forums');
require('dotenv').config();

const mongoDB = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASSWORD}@cluster0.ifu8n0w.mongodb.net/?retryWrites=true&w=majority`;

main().catch((err) => console.log(err));

async function main() {
  console.log("Connecting to DB...")
  await mongoose.connect(mongoDB, { dbName: "members-only" })
  console.log("Successfully connected to DB!")
};

async function createForum(name, password) {
    const forum = await new Forum({
        name: name,
        password: password
    })
    await forum.save();
};

createForum("Cats", process.env.CATS_FORUM_PASSWORD);
createForum("Dogs", process.env.DOGS_FORUM_PASSWORD);
createForum("Lizards", process.env.LIZARDS_FORUM_PASSWORD);
createForum("Snakes", process.env.SNAKES_FORUM_PASSWORD);