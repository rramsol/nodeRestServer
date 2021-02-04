const express = require("express");
const Usuario = require("../models/user");
const bcrypt = require("bcrypt");

const _ = require("underscore");

const app = express();

//obtener datos
app.get("/usuario", function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    //adentro del find van las condiciones como google:true
    //puedo poner que campos quiero mostrar en la salida
    Usuario.find({ estado: true }, "nombre email role estado google img")
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            //contador de usuarios

            //con el estado: true cuenta solo los usuarios que estan activos
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo,
                });
            });
        });
});

//paquete para procesar informacion que viene el post, y la serializa en un objeto json
//npm install body-parser

//guardar un usuario en la base de datos
app.post("/usuario", function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    usuario.save((err, UsuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        //UsuarioDB.password = null;

        res.json({
            ok: true,
            usuario: UsuarioDB,
        });
    });
});

//Buscar y actualizar usuario

app.put("/usuario/:id", function(req, res) {
    let id = req.params.id;

    //_.pick es un metodo de underscore https://underscorejs.org/#pick revisar mas metodos que se pueden usar
    //.pick regresa un objeto solo con los valores que queremos actualizar
    let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

    //MONGOOSE las opciones new regresa el registro ya actualizado y runValidator verifica en el modelo
    //todas las validaciones como el del role

    Usuario.findByIdAndUpdate(
        id,
        body, { new: true, runValidators: true },
        (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                usuario: usuarioDB,
            });
        }
    );
});

//Borrar usuario
app.delete("/usuario/:id", function(req, res) {
    let id = req.params.id;

    let cambiaEstado = { estado: false };

    Usuario.findByIdAndUpdate(
        id,
        cambiaEstado, { new: true },
        (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                usuario: usuarioDB,
            });
        }
    );

    //Eliminar registro fisico en la BD
    /*     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
                          if (err) {
                              return res.status(400).json({
                                  ok: false,
                                  err,
                              });
                          }

                          if (!usuarioBorrado) {
                              return res.status(400).json({
                                  ok: false,
                                  err: {
                                      message: "Usuario no encontrado",
                                  },
                              });
                          }

                          res.json({
                              ok: true,
                              usuario: usuarioBorrado,
                          });
                      }); 
                      */
});

module.exports = app;