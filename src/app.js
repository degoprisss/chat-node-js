const path = require("path");
const express = require("express");
const models = require("./models");
const routes = require("./routes");
require('dotenv').config();

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public/", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.json({"api": "1.0.0"});
});

app.use("/api/v1", routes.authRoutes, routes.roomRoutes);

//Middleware para manejar errores
app.use((err, req, res, next) => {
    console.log(err.stack);
    switch(err.name){
        case 'SequelizeValidationError': 
            const errObj = { message: "Validation Error", errors: [] };
            err.errors.map( er => {
                errObj.errors.push({[er.path]: er.message});
            })
            return res.status(403).send(errObj);
        case 'SequelizeUniqueConstraintError':
            return res.status(403).send({message: "Ya existe un registro con el mismo valor."});
        case 'TokenExpiredError':
            return res.status(401).send({message: "El token ha expirado."});
        default:
            return res.status(500).send('Server error');
    }
});



models.sequelize
  .authenticate()
  .then(() => console.log(`Sequelize connected to database`),
  err => console.error("Unable to connect to the database:", err),
  );


module.exports = app;