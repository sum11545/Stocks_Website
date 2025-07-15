const mongoose = require("mongoose");

const nifty500 = mongoose.Schema(
  {
    SYMBOL: String,
    OPEN: Number,
    HIGH: Number,
    LOW: Number,
    PREVCLOSE: Number,
    LTP: Number,
    INDICATIVECLOSE: Number,
    CHNG: Number,
    CHNGPERCENT: Number,
    VOLUME: Number,
    VALUE: Number,
    YEARHIGH: Number,
    YEARLOW: Number,
    MONTHCHANGE: Number,
    YEARCHANGE: Number,
    DATE: Date,
    STATUS: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    SERIAL_NO: {
      type: Number,
    },
    SECTOR: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nifty500", nifty500);
