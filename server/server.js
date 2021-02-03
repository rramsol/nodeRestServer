require("../server/config/config");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json Obtenemos el BODY ya procesado
app.use(bodyParser.json());

app.get("/usuario", function(req, res) {
    res.json("get usuarios");
});

//paquete para procesar informacion que viene el post, y la serializa en un objeto json
//npm install body-parser

app.post("/usuario", function(req, res) {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: "El Nombre es necesario",
        });
    } else {
        res.json({
            body,
        });
    }
});

app.put("/usuario/:id", function(req, res) {
    let id = req.params.id;

    res.json({
        id,
    });
});

app.delete("/usuario", function(req, res) {
    res.json("delete usuarios");
});

app.listen(process.env.PORT, () => {
    console.log("escuchando puerto: ", process.env.PORT);
});