const express = require("express");
const db = require("./config/connection");
// routes

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// route

db.once("open", () => {
    app.listen(PORT, () => {
        console.log(`API server running on PORT ${PORT}!`);
    });
});