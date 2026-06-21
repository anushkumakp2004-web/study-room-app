const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: String,
  password: String,
  owner: String,
});

module.exports = mongoose.model("Room", roomSchema);