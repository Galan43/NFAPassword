var ruta = require("express").Router();
var fs=require("fs");
var {  mostrarUsuarios, nuevoUsuario,buscarPorID, modificarUsuario,  borrarUsuario,buscarPorUsuario,verificarPassword} = require("../BD/usuariosBD");
var subirArchivo=require("../middlewares/subirArchivo")
var {autorizado, admin}=require("../middlewares/funcionesPassword")



ruta.get("/usuarios", autorizado, async (req, res) => {
  // if(req.session.usuario){
  var usuarios = await mostrarUsuarios();
  // // console.log(usuarios);
  res.render("usuarios/mostrar", { usuarios });
  //  else {
  //   res.redirect("/")
  //  } // console.log(usuarios);
});

ruta.get("/nuevousuario", async (req, res) => {
  res.render("usuarios/nuevo");
});

ruta.post("/nuevousuario", subirArchivo(), async (req, res) => {
  req.body.foto=req.file.originalname;
  var error = await nuevoUsuario(req.body);
  res.redirect("/");
});

ruta.get("/editar/:id", async (req, res) => {
  var user = await buscarPorID(req.params.id);
  console.log(user);
  res.render("usuarios/modificar", { user });
});


ruta.post("/editar", subirArchivo(), async (req, res) => {

  try {
      const usuarioAct = await buscarPorID(req.body.id);
      if (req.file) {
          req.body.foto = req.file.originalname;

          if (usuarioAct.foto) {
              const rutaFotoAnterior = `web/images/${usuarioAct.foto}`;
              fs.unlinkSync(rutaFotoAnterior);
          } 
          else{
            req.body.foto = req.body.fotoViejo;
          }
      }
      await modificarUsuario(req.body);
      res.redirect("/usuarios");
  } catch (error) {
      console.error("Error al editar pr:", error);
      res.status(500).send("Error interno del servidor");
  }
});

ruta.get("/borrar/:id", async (req, res) => {
  var usuario=await buscarPorID(req.params.id)
  if(usuario){
  var foto= usuario.foto;
  fs.unlinkSync(`web/images/${foto}`);
  await borrarUsuario(req.params.id);
  }
  res.redirect("/usuarios");
});

ruta.get("/", async (req, res) =>{
  res.render("usuarios/login");
});

ruta.post("/login", async (req, res) => {
  var { usuario, password } = req.body;
  var  usuarioEnt = await buscarPorUsuario(usuario);
  if (usuarioEnt) {
    var passwordCorrect = await verificarPassword(password, usuarioEnt.password,usuarioEnt.salt);
    if (passwordCorrect) {
      if(usuarioEnt.admin){
        req.session.admin = usuarioEnt.admin;
        res.redirect("/pro/pro/nuevoproducto");
      }else{
        req.session.usuario = usuarioEnt.usuario;  
        res.redirect("/usuarios");
      }
    } else {
      console.log("Usuario o contraseña incorrectos");
      res.render("usuarios/login");
    }
  } else {
    console.log("Usuario o contraseña incorrectos"); 
    res.render("usuarios/login");
  }
});

ruta.get("/logout", (req,res)=>{
req.session=null;
res.redirect("/");
});

module.exports = ruta;
