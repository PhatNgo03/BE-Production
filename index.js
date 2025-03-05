const express = require("express");
const path = require('path');
const moment = require("moment");
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
//declare socket io
const http = require('http');
const { Server } = require("socket.io");

database.connect();
const app = express();

const server = http.createServer(app);

const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
  });

//override method CRUD 
app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
const port = process.env.PORT;

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//Flash notification 
app.use(cookieParser('eedf3c58-e8ce-47d1-9fc4-43b66fb2eb0d'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

//TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//End TinyMCE

//App Local Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;
app.use(express.static(`${__dirname}/public`));


//Routes admin
routeAdmin(app);

//Routes client
route(app);
//not found
app.get("*", (req, res) => {
    res.render("client/pages/errors/404", {
        pageTitle: "404 Not Found",
    });
});

server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
