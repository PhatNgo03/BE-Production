const express = require("express");
require('dotenv').config();
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");
const database = require("./config/database");
const systemConfig = require("./config/system");
const methodOverride = require("method-override");
const bodyParser = require('body-parser');
const flash = require("express-flash");
const cookieParser = require('cookie-parser');
const session = require('express-session');

database.connect();
const app = express();
//override method CRUD 
app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

//Flash notification 
app.use(cookieParser('eedf3c58-e8ce-47d1-9fc4-43b66fb2eb0d'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

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
