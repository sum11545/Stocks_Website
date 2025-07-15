const express = require("express");
const route = express.Router();
const csv = require("csvtojson");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const BhavCopy = require("../model/bhavCopyModel");
const Nifty500 = require("../model/nifty500Model");
const percentModel = require("../model/perCentChange");

route.use(express.json());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

route.get("/", (req, res) => {
  res.send("Welcome to home page");
});

const parseNum = (value) => {
  const clean = (value || "").replace(/,/g, "").trim();
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
};

route.post("/BhavCopyUpload", upload.single("csvFile"), async (req, res) => {
  try {
    const filePath = req.file?.path;
    if (!filePath) {
      return res.status(400).json({ message: "CSV file is required." });
    }
    const DateInput = req.body.date;
    console.log(DateInput);
    const checkDuplicate = await BhavCopy.findOne({ DATE: DateInput });
    if (checkDuplicate) {
      return res.json("Data for this date is Already there");
    }
    if (!DateInput || isNaN(new Date(DateInput))) {
      return res
        .status(400)
        .json({ message: "Valid date is required in 'date' field." });
    }
    const data = await csv({
      noheader: false,
      headers: [
        "MKT",
        "SERIES",
        "SYMBOL",
        "SECURITY",
        "PREV_CLOSE_PRICE",
        "OPEN_PRICE",
        "HIGH_PRICE",
        "LOW_PRICE",
        "CLOSE_PRICE",
        "NET_TRADE_VALUE",
        "NET_TRADED_QTY",
        "IND_SEC",
        "CORP_IND",
        "TRADES",
        "YEAR_HIGH",
        "YEAR_LOW",
      ],
    }).fromFile(filePath);

    let serial = 1;

    const stockData = data.map((item) => ({
      MKT: item.MKT?.trim(),
      SERIES: item.SERIES?.trim(),
      SYMBOL: item.SYMBOL?.trim(),
      SECURITY: item.SECURITY?.trim(),
      PREV_CLOSE_PRICE: parseNum(item.PREV_CLOSE_PRICE),
      OPEN_PRICE: parseNum(item.OPEN_PRICE),
      HIGH_PRICE: parseNum(item.HIGH_PRICE),
      LOW_PRICE: parseNum(item.LOW_PRICE),
      CLOSE_PRICE: parseNum(item.CLOSE_PRICE),
      NET_TRADE_VALUE: parseNum(item.NET_TRADE_VALUE),
      NET_TRADED_QTY: parseNum(item.NET_TRADED_QTY),
      IND_SEC: item.IND_SEC?.trim(),
      CORP_IND: item.CORP_IND?.trim(),
      TRADES: parseNum(item.TRADES),
      YEAR_HIGH: parseNum(item.YEAR_HIGH),
      YEAR_LOW: parseNum(item.YEAR_LOW),
      DATE: DateInput,
      CHANGE_1M: "",
      CHANGE_3M: "",
      CHANGE_6M: "",
      DAILY_AVG_1M: "",
      STATUS: "Active",
      SERIAL_NO: serial++,
      SECTOR: "",
    }));

    await BhavCopy.insertMany(stockData);
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete file:", err);
      else console.log("Temp file deleted:", filePath);
    });

    res.status(201).json({
      message: "Stock data inserted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in uploading file",
      errpr: error.message,
    });
  }
});

route.post("/Nifty500Upload", upload.single("csvFile"), async (req, res) => {
  try {
    const filePath = req.file?.path;
    if (!filePath) {
      return res.status(400).json({ message: "CSV file is required." });
    }
    const DateInput = req.body.date;
    console.log(DateInput);
    if (!DateInput || isNaN(new Date(DateInput))) {
      return res
        .status(400)
        .json({ message: "Valid date is required in 'date' field." });
    }
    const data = await csv({
      noheader: false,
      headers: [
        "SYMBOL",
        "OPEN",
        "HIGH",
        "LOW",
        "PREVCLOSE",
        "LTP",
        "INDICATIVECLOSE",
        "CHNG",
        "CHNGPERCENT",
        "VOLUME",
        "VALUE",
        "YEARHIGH",
        "YEARLOW",
        "MONTHCHANGE",
        "YEARCHANGE",
      ],
    }).fromFile(filePath);

    let serial = 1;

    const stockData = data.map((item) => ({
      SYMBOL: item.SYMBOL?.trim(),
      OPEN: parseNum(item.OPEN),
      HIGH: parseNum(item.HIGH),
      LOW: parseNum(item.LOW),
      PREVCLOSE: parseNum(item.PREVCLOSE),
      LTP: parseNum(item.LTP),
      INDICATIVECLOSE: parseNum(item.INDICATIVECLOSE),
      CHNG: parseNum(item.CHNG),
      CHNGPERCENT: parseNum(item.CHNGPERCENT),
      VOLUME: parseNum(item.VOLUME),
      VALUE: parseNum(item.VALUE),
      YEARHIGH: parseNum(item.YEARHIGH),
      YEARLOW: parseNum(item.YEARLOW),
      MONTHCHANGE: parseNum(item.MONTHCHANGE),
      YEARCHANGE: parseNum(item.YEARCHANGE),
      DATE: DateInput,
      SERIAL_NO: serial++,
      STATUS: "Active",
      SECTOR: "",
    }));

    await Nifty500.insertMany(stockData);
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete file:", err);
      else console.log("Temp file deleted:", filePath);
    });

    res.status(201).json({
      message: "Nifty500 Stock data inserted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in uploading file",
      errpr: error.message,
    });
  }
});

route.post("/AllIndicesUpload", upload.single("csvFile"), async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in uploading file",
      error: error.message,
    });
  }
});

route.post("/bseSensexUpload", upload.single("csvFile"), async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in uploading file",
      error: error.message,
    });
  }
});

route.get("/bhavCopyReportNew52High/:date", async (req, res) => {
  try {
    const dateStr = req.params.date;
    const date = new Date(dateStr);

    const data = await BhavCopy.find({ DATE: date });

    const newHighs = data
      .filter((d) => d.YEAR_HIGH == d.HIGH_PRICE)
      .map((d) => ({
        SYMBOL: d.SYMBOL,
        DATE: d.DATE,
        YEAR_HIGH: d.YEAR_HIGH,
        HIGH_PRICE: d.HIGH_PRICE,
        SECURITY: d.SECURITY,
      }));

    res.json({
      date: dateStr,
      count: newHighs.length,
      newHighs,
      securityName: newHighs.SECURITY,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
route.get("/bhavCopyReportNew52Low/:date", async (req, res) => {
  try {
    const dateStr = req.params.date;
    const date = new Date(dateStr);

    const data = await BhavCopy.find({ DATE: date });

    const newHighs = data
      .filter((d) => d.YEAR_LOW === d.LOW_PRICE)
      .map((d) => ({
        SYMBOL: d.SYMBOL,
        DATE: d.DATE,
        YEAR_LOW: d.YEAR_LOW,
        LOW_PRICE: d.LOW_PRICE,
        SECURITY: d.SECURITY,
      }));

    res.json({ date: dateStr, count: newHighs.length, newHighs });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

route.get("/oneMonthHigh/:date", async (req, res) => {
  try {
    const dateStr = req.params.date;
    const symbol = req.query.SYMBOL;

    if (!symbol) {
      return res.status(400).json({ error: "SYMBOL query param is required" });
    }

    const endDate = new Date(dateStr);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 30);

    const records = await BhavCopy.find({
      SYMBOL: symbol,
      DATE: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    if (!records || records.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for this period" });
    }

    let resArr = [];
    let maxHighRecord = records.map((e) => {
      return resArr.push(e.HIGH_PRICE);
    });

    console.log(maxHighRecord);
    console.log(resArr);
    let maxValue = Math.max(...resArr);

    res.json({
      SYMBOL: symbol,
      SECURITY: maxHighRecord.SECURITY,
      from: startDate.toISOString().split("T")[0],
      to: endDate.toISOString().split("T")[0],
      oneMonthHigh: maxValue,
      dateOfHigh: maxHighRecord.DATE,
      fullRecord: maxHighRecord,
    });
  } catch (error) {
    console.error("Error checking 1-month highs:", error);
    res.status(500).json({ error: error.message });
  }
});

route.get("/oneMonthLow/:date", async (req, res) => {
  try {
    const dateStr = req.params.date;
    const symbol = req.query.SYMBOL;

    if (!symbol) {
      return res.status(400).json({ error: "SYMBOL query param is required" });
    }

    const endDate = new Date(dateStr);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 30);

    const records = await BhavCopy.find({
      SYMBOL: symbol,
      DATE: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    if (!records || records.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for this period" });
    }

    let resArr = [];
    let maxMinRecord = records.map((e) => {
      return resArr.push(e.LOW_PRICE);
    });

    console.log(maxMinRecord);
    console.log(resArr);
    let minValue = Math.min(...resArr);

    res.json({
      SYMBOL: symbol,
      SECURITY: records.SECURITY,
      from: startDate.toISOString().split("T")[0],
      to: endDate.toISOString().split("T")[0],
      oneLowHigh: minValue,
      dateOfHigh: maxMinRecord.DATE,
      fullRecord: maxMinRecord,
    });
  } catch (error) {
    console.error("Error checking 1-month highs:", error);
    res.status(500).json({ error: error.message });
  }
});

route.get("/6DaysTrend/:date", async (req, res) => {
  try {
    const symbol = req.query.SYMBOL;
    const endDate = new Date(req.params.date);

    if (!symbol) {
      return res.status(400).json({ error: "SYMBOL query param is required" });
    }

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6);

    const records = await BhavCopy.find({
      SYMBOL: symbol,
      DATE: { $gte: startDate, $lte: endDate },
    }).sort({ DATE: 1 });

    if (records.length < 2) {
      return res
        .status(404)
        .json({ message: "Not enough data to determine trend" });
    }

    const closePrices = records.map((record) => record.CLOSE_PRICE);

    const detectTrend = (closePrices) => {
      const isUptrend = closePrices.every(
        (val, i, arr) => i === 0 || val >= arr[i - 1]
      );
      const isDowntrend = closePrices.every(
        (val, i, arr) => i === 0 || val <= arr[i - 1]
      );

      if (isUptrend) return "UPTREND";
      if (isDowntrend) return "DOWNTREND";
      return "NEUTRAL";
    };

    const trend = detectTrend(closePrices);

    res.json({
      symbol,
      from: startDate.toISOString().split("T")[0],
      to: endDate.toISOString().split("T")[0],
      closePrices,
      trend,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

route.get("/13DaysTrend/:date", async (req, res) => {
  try {
    const symbol = req.query.SYMBOL;
    const endDate = new Date(req.params.date);

    if (!symbol) {
      return res.status(400).json({ error: "SYMBOL query param is required" });
    }

    // Calculate start date (13 days before the given date)
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 13);

    // Fetch 13 days of data for the stock
    const records = await BhavCopy.find({
      SYMBOL: symbol,
      DATE: { $gte: startDate, $lte: endDate },
    }).sort({ DATE: 1 }); // Ensure it's in chronological order

    if (records.length < 2) {
      return res
        .status(404)
        .json({ message: "Not enough data to determine trend" });
    }

    // Extract close prices
    const closePrices = records.map((record) => record.CLOSE_PRICE);

    // Determine trend
    const detectTrend = (closePrices) => {
      const isUptrend = closePrices.every(
        (val, i, arr) => i === 0 || val >= arr[i - 1]
      );
      const isDowntrend = closePrices.every(
        (val, i, arr) => i === 0 || val <= arr[i - 1]
      );

      if (isUptrend) return "UPTREND";
      if (isDowntrend) return "DOWNTREND";
      return "NEUTRAL";
    };

    const trend = detectTrend(closePrices);

    // Send response
    res.json({
      symbol,
      from: startDate.toISOString().split("T")[0],
      to: endDate.toISOString().split("T")[0],
      closePrices,
      trend,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

route.get("/symbols", async (req, res) => {
  const query = req.query.q?.toUpperCase();
  const matches = await BhavCopy.find({
    SYMBOL: { $regex: `^${query}`, $options: "i" },
  })
    .limit(10)
    .distinct("SYMBOL");
  res.json(matches);
});

route.post("/addPercentValue", async (req, res) => {
  try {
    const { label, value } = req.body;

    // Check if label already exists
    const existing = await percentModel.findOne({ label });
    if (existing) {
      return res.status(400).json({
        message: "Label already exists",
      });
    }

    // Get the latest SERIAL_NO (auto-increment simulation)
    const lastRecord = await percentModel.findOne().sort({ SERIAL_NO: -1 });
    const serialno = lastRecord ? lastRecord.SERIAL_NO + 1 : 1;

    // Save new record
    const newEntry = new percentModel({
      label,
      value,
      SERIAL_NO: serialno,
    });

    await newEntry.save();

    return res.status(201).json({
      message: "Percent value saved successfully",
      data: newEntry,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

route.post("/predictClosePrice", async (req, res) => {
  try {
    console.log("I am Running");

    const { symbol, date } = req.body;

    if (!symbol || !date) {
      return res.status(400).json({ message: "symbol and date are required" });
    }

    const existingClosePrice = await BhavCopy.findOne({
      SYMBOL: symbol,
      DATE: new Date(date), // Fixed: use JS Date
    });

    if (!existingClosePrice) {
      return res
        .status(404)
        .json({ message: "Close price not found for given symbol and date" });
    }

    const allValues = await percentModel.find({});

    const predictions = allValues.map((entry) => {
      const predictedPrice =
        existingClosePrice.CLOSE_PRICE * entry.value +
        existingClosePrice.CLOSE_PRICE;

      return {
        label: entry.label,
        value: entry.value,
        predictedPrice: predictedPrice.toFixed(2),
      };
    });

    return res.json({
      symbol,
      date,
      actualClosePrice: existingClosePrice.CLOSE_PRICE,
      predictions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = route;
