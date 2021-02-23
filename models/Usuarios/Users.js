var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

var UsersSchema = new Schema({
  names: {
    type: String,
    trim: true,
    required: true,
  },

  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    trim: true,
    required: true,
  },
});

//funcion llamada desde passport para comprobar que la contraseña sea correcta
//encripta la contraseña mandada y la compara con la ya encriptada en la bd
UsersSchema.methods.validPassword = function (pwd) {
  return bcrypt.compareSync(pwd, this.password);
};

module.exports = mongoose.model("Users", UsersSchema);
