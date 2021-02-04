require("../server/config/config");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json Obtenemos el BODY ya procesado
app.use(bodyParser.json());

app.use(require("./routes/user"));

mongoose.connect(
    process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;

        console.log("Base de datos ONLINE");
    }
);

app.listen(process.env.PORT, () => {
    console.log("escuchando puerto: ", process.env.PORT);
});