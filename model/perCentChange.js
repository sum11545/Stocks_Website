const mongoose = require("mongoose");

const percentChange = mongoose.Schema(
  {
    SERIAL_NO: Number,
    label: String,
    value: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("percentChange", percentChange);
