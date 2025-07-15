const mongoose = require("mongoose");

const allIndices = mongoose.Schema({
  INDEX: String,
  CURRENT_VALUE: Number,
  PERCENT_CHANGE: Number,
  OPEN: Number,
  HIGH: Number,
  LOW: Number,
  INDICATIVE_CLOSE: Number,
  PREV_CLOSE: Number,
  PREV_DAY_CLOSE: Number,
  ONE_WEEK_AGO_CLOSE: Number,
  ONE_MONTH_AGO_CLOSE: Number,
  ONE_YEAR_AGO_CLOSE: Number,
  ONE_YEAR_HIGH: Number,
  ONE_YEAR_LOW: Number,
  ONE_YEAR_CHANGE: Number,
  ONE_MONTH_CHANGE: Number,
  ONE_WEEK_CHANGE: Number,
  STATUS: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  SERIAL_NO: {
    type: Number,
  },
});

module.exports = mongoose.model("ALLIndices", allIndices);
