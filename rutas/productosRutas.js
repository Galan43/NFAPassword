var rutapro = require("express").Router();
var { mostrarProductos,nuevoProducto,borrarProducto,modificarProducto, probuscarPorID } = require("../BD/ProductosBD");
var subirArchivo = require("../middlewares/subirArchivo");
var fs=require("fs")
var {autorizado, admin}=require("../middlewares/funcionesPassword")


rutapro.get("/pro/mostrarproductos", async (req, res) => {
  var productos = await mostrarProductos();
  res.render("productos/mostrarPro", { productos });
});

rutapro.get("/pro/nuevoproducto",admin, (req, res) => {
  res.render("productos/nuevoPro");
});

rutapro.post("/pro/nuevoproducto",subirArchivo(), async (req, res) => {
  req.body.foto=req.file.originalname;
  var error = await nuevoProducto(req.body);
  res.redirect("/pro/pro/mostrarproductos");
});

rutapro.get("/pro/editarPro/:id", async (req, res) => {
  var product = await probuscarPorID(req.params.id);
  res.render("productos/modificarPro", { product });
});

rutapro.post("/pro/editarPro",subirArchivo(), async (req, res) => {
  try {
    const productoAct = await probuscarPorID(req.body.id);
    if (req.file) {
        req.body.foto = req.file.originalname;
        if (productoAct.foto) {
            const rutaFotoAnterior = `web/images/${productoAct.foto}`;
            fs.unlinkSync(rutaFotoAnterior);
        }
    }
    var error = await modificarProducto(req.body);
    res.redirect("/pro/pro/mostrarproductos");
  } catch (error) {
    console.error("Error al editar producto:", error);  
    res.status(500).send("Error interno del servidor");
  }
  
});




rutapro.get("/pro/borrarPro/:id", async (req, res) => {
  var producto=await probuscarPorID(req.params.id)
  if(producto){
  var foto= producto.foto;
  fs.unlinkSync(`web/images/${foto}`);
  await borrarProducto(req.params.id);
  }
  res.redirect("/pro/pro/mostrarproductos");
});

module.exports = rutapro;
