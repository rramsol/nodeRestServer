const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let rolesValidos = {
    values: ["ADMIN_ROLE", "USER_ROLE"],
    message: "{VALUE} no es un rol válido",
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"],
    },
    email: {
        unique: true,
        type: String,
        required: [true, "El correo es necesario"],
    },
    password: {
        type: String,
        required: [true, " La contraseña es obligatoria"],
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: "USER_ROLE",
        required: false,
        enum: rolesValidos,
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});

//quitar la contraseña en la respuesta json

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

usuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser unico" });

module.exports = mongoose.model("Usuario", usuarioSchema);