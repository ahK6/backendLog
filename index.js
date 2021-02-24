const express = require("express");
const routes = require("./routes/usersRoute");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
var http = require("http");
var flash = require("connect-flash");
const session = require("express-session");

(config = require("./config/config")),
  require("./config/authentication/passport");

const cors = require("cors");
//conectarse a mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017/testapi", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//crear el servidor
const app = express();
var server = http.Server(app);
app.use(flash());

//configuracion para que la session de passport sea almacenada
app.set("llave", config.llave);
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

//habilitar body parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());
//router

app.use("/", require("./routes/usersRoute"));

app.use(function (req, res, next) {
  res.status(404);
  res.json({ mensaje: "Ruta no encontrada" });
});

server.listen(5000, () => {
  console.log("server connected");
});
