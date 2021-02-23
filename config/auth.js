//importamos el paquete de JWT el cual nos servira para asegurar los endpoints
//leyendo de las cabeceras que el usuario tenga un token valido
const jwt = require("jsonwebtoken");

//importamos la llave privada para poder verificar la validez del token
const key = require("../config/config");

module.exports = (req, res, next) => {
  //Consultamos que en la cabecera Exista un token
  const authHeader = req.get("Authorization");

  console.log(authHeader);

  //comprueba que exista la cabecera del token, sino existe es porque el usuario no ha iniciado sesion

  if (!authHeader) {
    const error = new Error("No autenticado, no hay JWT");

    //devolvemos el codigo 401 para poder leerlo luego en nuestro frontend
    error.statusCode = 401;
    throw error;
  }

  //si hay token, lo partira del "Bearer" para asi poder comprobarlo
  const token = authHeader.split(" ")[1];
  let revisarToken;

  //comprobamos si el token es valido
  try {
    //Verificamos que el token no haya expirado
    revisarToken = jwt.verify(token, key.llave);
  } catch (error) {
    //si el token ha expirado arrojara un error, deteniendo la ejecucion del codigo aqui
    //enviamos el codigo de error para poder leerlo en nuestro frontend
    error.statusCode = 500;
    throw error;
  }

  //comprueba si existe un token en le cabecera, si no existe significa que no ha iniciado sesion o que el token no esta siendo recibido
  if (!revisarToken) {
    const error = new Error("No autenticado");
    error.statusCode = 401;
    throw error;
  }
  next();
};
