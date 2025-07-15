const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    MKT: String,
    SERIES: String,
    SYMBOL: String,
    SECURITY: String,
    PREV_CLOSE_PRICE: Number,
    OPEN_PRICE: Number,
    HIGH_PRICE: Number,
    LOW_PRICE: Number,
    CLOSE_PRICE: Number,
    NET_TRADE_VALUE: Number,
    NET_TRADED_QTY: Number,
    IND_SEC: String,
    CORP_IND: String,
    TRADES: String,
    YEAR_HIGH: Number,
    YEAR_LOW: Number,
    DATE: {
      type: Date,
      required: true,
    },

    CHANGE_1M: Number,
    CHANGE_3M: Number,
    CHANGE_6M: Number,
    DAILY_AVG_1M: Number,
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

module.exports = mongoose.model("BhavCopy", stockSchema);
