const express = require("express");
require('.env').config()
const app =express();
const cors =require("cors");

// middlewares;
app.use(cors());
app.use(express.json())

const port = process.eventNames.PORT || 8080
app.listen(port, () => console.log('listenig on port ${port}...'))