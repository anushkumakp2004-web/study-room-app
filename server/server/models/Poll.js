const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  room: String,
  question: String,
  options: [String],
  votes: {
    type: Map,
    of: Number,
    default: {},
  },
});

module.exports = mongoose.model(
  "Poll",
  pollSchema
);