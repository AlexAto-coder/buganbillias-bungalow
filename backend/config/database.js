const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        rejectUnauthorized: false
    }
});

connection.connect((err) => {

    if (err) {
        console.error("❌ Error al conectar con MySQL");
        console.error(err);
        return;
    }

    console.log("✅ Base de datos conectada correctamente");

});

module.exports = connection;