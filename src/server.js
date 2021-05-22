const app = require('./app');

app.listen(app.get("port"), () => {
    console.log(`Servidor escuchando sobre el puerto ${app.get("port")}`);
});