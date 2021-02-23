//importamos passport.js y la "estrategia local" que es el tipo de
//autenticacion que se usara en el proyecto
var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;

//importamos los modelos de los tipos de usuarios que existen
//para hacer la consulta a la base de datos por medio de email y password
const usersLog = require("../../models/Usuarios/Users");

//Creacion de la estrategia local y consulta que email y clave  coincidan
passport.use(
  "usersLogin",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    function (username, password, done) {
      //consulta a la base de datos que el email proporcionado exista
      usersLog.findOne({ email: username }, function (err, user) {
        //si existe algun tipo de error, lo retornara
        if (err) {
          return done(err);
        }

        //si el email solicitado no existe, retornara un error de email incorrecto
        if (!user) {
          return done(null, false, { message: "Incorrect Email." });
        }
        //Si email existe, encriptara la clave dada por el usuario y la
        //comparara con la ecriptada almacenada en la base de datos
        //Si la clave es incorrecta arrojara contraseña incorrecta
        if (!user.validPassword(password)) {
          return done(null, false, { message: "Incorrect password." });
        }

        //Si el email y password son correctos continuara el ciclo de inicio de sesion
        return done(null, user);
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  usersLog.findById(id, function (err, user) {
    done(err, user);
  });
});
