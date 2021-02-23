const express = require("express");
const router = express.Router();

var LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const jwt = require("jsonwebtoken");
const key = require("../config/config");
const auth = require("../config/auth");
const userController = require("../controllers/manageUsers/UsersController");

router.post("/newuser", userController.newUser);

router.get("/ver-usuarios", auth, userController.getUsersList);

//iniciar sesion
router.post("/iniciar-sesion", function (req, res, next) {
  //llama a la estrategia local "usersLogin"
  passport.authenticate("usersLogin", function (err, user) {
    if (err) {
      //si existe un error lo muestra
      return next(err);
    }
    if (!user) {
      //si no recibe nada de la estrategia loca, retorna un error 401
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrectos" });
    }
    //si la autenticacion fue exitosa
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      //firmamos un token, para luego poder usarlo en las cabeceras y obtener mas seguridad
      //haciendo uso de este y de passport.js
      const token = jwt.sign(
        {
          email: req.user.email,
          usuario: req.user.names,
          id: req.user.id,
        },

        key.llave,
        {
          expiresIn: "1h",
        }
      );
      console.log(token);
      //devolvemos un error 200 junto al token el cual sera almacenado por
      //el frontend para luego enviarlo mediante cabeceras
      res.status(200).json({ token: token });
    });
  })(req, res, next);
});

module.exports = router;
