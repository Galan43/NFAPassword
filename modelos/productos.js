class Productos {
    constructor(id, data) {
      this.bandera = 0;
      this.id = id;
      this.nombre = data.nombre;
      this.precio = data.precio;
      this.foto = data.foto;
    }
    set id(id) {
        if (id != null) id.length > 0 ? (this._id = id) : (this.bandera = 1);  
      }
    set nombre(nombre) {
      nombre.length > 0 ? (this._nombre = nombre) : (this.bandera = 1);
    }
    set precio(precio) {
      precio.length > 0 ? (this._precio = precio) : (this.bandera = 1);
    }
    set foto(foto) {
      foto.length >= 0 ? (this._foto = foto) : (this.bandera = 1);
    }
    get id() {
      return this._id;
    }
    get nombre() {
      return this._nombre;
    }
    get precio() {
      return this._precio;
    }
    get foto() {
      return this._foto;
    }
    get obtenerDatos() {
      if (this._id != null) {
        return {
          id: this.id,
          nombre: this.nombre,
          precio: this.precio,
          foto: this.foto,
        };
      } else {
        return {
          nombre: this.nombre,
          precio: this.precio,
          foto: this.foto,
        };
      }
    }
  }
  
  module.exports = Productos;

