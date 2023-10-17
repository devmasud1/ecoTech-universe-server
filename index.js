const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
//middleware close

app.get("/", (req, res) => {
  res.send("EcoTechUniverse is running....");
});

app.listen(port, () => {
  console.log(`EcoTechUniverse listening on port ${port}`);
});
