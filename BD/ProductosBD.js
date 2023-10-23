var conexionpro = require("./conexion").conexionPro;
var Productos = require("../modelos/productos");

async function mostrarProductos() {
  var products = [];
  try {
    var productos = await conexionpro.get();
    productos.forEach((producto) => {
      var product = new Productos(producto.id, producto.data());
      if (product.bandera == 0) {
        products.push(product.obtenerDatos);
      }
    });
  } catch (err) {
    console.log("Error al recuperar productos de la base de datos: " + err);
  }
  return products;
}

async function probuscarPorID(id) {
  var product = "";
  try {
    var producto = await conexionpro.doc(id).get();
    var productoObjeto = new Productos(producto.id, producto.data());
    if (productoObjeto.bandera == 0) {
      product = productoObjeto.obtenerDatos;
    }
  } catch (err) {
    console.log("Error al recuperar el producto: " + err);
  }
  return product;
}

async function nuevoProducto(datos) {
  var product = new Productos(null, datos);
  var error = 1;
  if (product.bandera == 0) {
    try {
      await conexionpro.doc().set(product.obtenerDatos);
      console.log("Producto insertado a la base de datos");
      error = 0;
    } catch (err) {
      console.log("Error al insertar el producto: " + err);
    }
  }
  return error;
}

async function modificarProducto(datos) {
  var error = 1;
  var respuestaBuscar = await probuscarPorID(datos.id);
  if (respuestaBuscar != "") {
    var product = new Productos(datos.id, datos);
    if (product.bandera == 0) {
      try {
        await conexionpro.doc(product.id).set(product.obtenerDatos);
        console.log("Modificado");
        error = 0;
      } catch (err) {
        console.log("Error al modificar el producto:" + err);
      }
    }
  } 
  return error;
}

async function borrarProducto(id) {
  var error = 1;
  var product = await probuscarPorID(id);
  if (product != "") {
    try {
      await conexionpro.doc(id).delete();
      console.log("Producto elminado de la base de datos");
      error = 0;
    } catch (err) {
      console.log("Error al eliminar el producto de la base de datos: " + err);
    }
  }
  return error;
}

module.exports = {
  mostrarProductos,
  probuscarPorID,
  modificarProducto,
  borrarProducto,
  nuevoProducto,
};
