const mongoose = require("mongoose");

const whiteboardSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
    unique: true,
  },

  data: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model(
  "Whiteboard",
  whiteboardSchema
);