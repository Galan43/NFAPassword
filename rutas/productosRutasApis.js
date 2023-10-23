var rutapro = require("express").Router();
var {mostrarProductos,  nuevoProducto,borrarProducto,modificarProducto,probuscarPorID } = require("../BD/ProductosBD");
var subirArchivo = require("../middlewares/subirArchivo");
var fs = require("fs");

rutapro.get("/pro/api/mostrarproductos", async (req, res) => {
  var productos = await mostrarProductos();
  if (productos.length > 0) {
    res.status(200).json(productos);
  } else {
    res.status(400).json("No hay productos");
  }
});

rutapro.post( "/pro/api/nuevoproducto", subirArchivo(), async (req, res) => {
    req.body.foto = req.file.originalname;
    var error = await nuevoProducto(req.body);
    if (error == 0) {
      res.status(200).json("Producto agregado");
    } else {
      res.status(400).json("Error al agregar producto");
    }
  }
);

rutapro.get("/pro/api/buscarProductoPorId/:id", async (req, res) => {
  var product = await probuscarPorID(req.params.id);
  if (product == "") {
    res.status(400).json("No se encontro el producto");
  } else {
    res.status(200).json(product);
  }
});

rutapro.post("/pro/api/editarPro", subirArchivo(), async (req, res) => {
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
    if (error == 0) {
      res.status(200).json("Producto modificado");
    } else {
      res.status(400).json("Error al modificar el producto");
    }
  } catch (error) {
    console.error("Error al editar pr:", error);  
    res.status(500).send("Error interno del servidor");
  }
});

rutapro.get("/pro/api/borrarPro/:id", async (req, res) => {
  try {
    var producto=await probuscarPorID(req.params.id)
    if(producto){
      var foto= producto.foto;
      fs.unlinkSync(`web/images/${foto}`);
      var error = await borrarProducto(req.params.id);
    }
    if (error == 0) {
      res.status(200).json("Producto borrado");
    } else {
      res.status(400).json("Error al borrar el producto");
    }
  } catch (error) {
    console.error("Error al borrar pr:", error);  
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = rutapro;
