const express = require("express");
const app = express();
require("./config/conn");
const equityRoute = require("./routes/equitiyRoute");
const cors = require("cors");
const axios = require("axios");
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

function websiteReloader() {
  const res = axios.get("https://stocks-website-26e1.onrender.com/");
  res
    .then((response) => {
      if (response.status == 200) {
        console.log("Website is running Live");
      } else {
        console.log("Error in Website ");
      }
    })
    .catch((Err) => {
      console.log("Error in Reloading ", Err);
    });
}

setInterval(websiteReloader, 600000);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
