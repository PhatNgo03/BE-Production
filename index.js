const express = require("express");
require('dotenv').config();
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");
const database = require("./config/database");
const systemConfig = require("./config/system");
const methodOverride = require("method-override")

database.connect();
const app = express();
//override method CRUD 
app.use(methodOverride('_method'))

const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

//App Local Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static("public"));


//Routes admin
routeAdmin(app);

//Routes client
route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
