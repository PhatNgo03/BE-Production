const express = require("express");
const route = require("./routes/client/index.route")
const app = express();
require('dotenv').config();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

//Routes
route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});