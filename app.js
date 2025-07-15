const express = require("express");
const app = express();
require("./config/conn");
const equityRoute = require("./routes/equitiyRoute");
const cors = require("cors");
const port = 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use("/", equityRoute);
app.get("/", (req, res) => {
  res.send("Hello Sumit");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
