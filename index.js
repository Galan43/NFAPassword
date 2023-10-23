const express = require("express");
var cors=require("cors");
var path=require("path")
const rutas = require("./rutas/usuariosRutas");
const rutapro = require("./rutas/productosRutas");
var rutasUsuariosApis = require("./rutas/usuariosRutasApis");
var productosRutasApis = require("./rutas/productosRutasApis");
// var session=require("express-session"); // se almacena el servidor 
var session=require("cookie-session");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.use(cors());
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  name:'session',
  keys:['asdjawnuidas45'],
  maxAge: 24 * 60 * 60*1000
}));

app.use("/", express.static(path.join(__dirname,"/web")))
app.use("/", rutas);
app.use("/pro", rutapro);
app.use("/",rutasUsuariosApis);
app.use("/pro",productosRutasApis);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Servidor en http://localhost:" + port);
});
