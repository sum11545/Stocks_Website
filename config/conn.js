const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://stock:GciQDwIWyvRdEJvh@mongollm.mvrreox.mongodb.net/Stocks?retryWrites=true&w=majority&appName=MongoLLM"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports;
