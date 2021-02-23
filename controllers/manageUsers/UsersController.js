//importamos el modelo de usuarios
const Users = require("../../models/Usuarios/Users");

//import bcrypt el cual servira para hashear los passwords
const bcrypt = require("bcrypt");

//Agregar nuevo usuario
exports.newUser = async (req, res, next) => {
  const user = new Users(req.body);

  //encripta el pasword
  user.password = await bcrypt.hash(req.body.password, 12);

  //Intentara guardar el registro
  try {
    await user.save();
    res.json({ mensaje: "La cuenta ha sido creada con exito" });
  } catch (error) {
    //si ocurre un problema devolvera el error

    if (error.code == 11000) {
      res.status(409).send({ mensaje: "El correo electronico ya está en uso" });
      next();
    } else {
      res.json({
        mensaje:
          "Ha ocurrido un error al completar el registro, por favor vuelve intentarlo" +
          error,
      });
      console.log("Ha ocurrido un error: " + error);
      next();
    }
  }
};

//Obtener todos los usuarios existentes
exports.getUsersList = async (req, res, next) => {
  // intentara obtener la lista de admins
  try {
    const userResponse = await Users.find();
    res.json(userResponse);
  } catch (error) {
    //si ocurrio un error al consultar los datos, mostrara dicho error
    res.json({
      mensaje:
        "Ha ocurrido un error al obtener los datos solicitados, por favor vuelve intentarlo",
    });
    console.log("Ha ocurrido un error: " + error);
    next();
  }
};
