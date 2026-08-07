// ==========================================================
// MODELO: CLIENTES
// ==========================================================

const db = require("../config/database");

// Obtener todos los clientes
const obtenerClientes = (callback) => {

    const sql = "SELECT * FROM clientes";

    db.query(sql, callback);

};

// Obtener un cliente por ID
const obtenerClientePorId = (id, callback) => {

    const sql = "SELECT * FROM clientes WHERE id = ?";

    db.query(sql, [id], callback);

};

// Buscar cliente por correo
const obtenerClientePorCorreo = (correo, callback) => {

    const sql = "SELECT * FROM clientes WHERE correo = ?";

    db.query(sql, [correo], callback);

};

// Crear un cliente
const crearCliente = (datos, callback) => {

    const sql = `
        INSERT INTO clientes
        (nombres, apellidos, dni, correo, password, telefono)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [

        datos.nombres,
        datos.apellidos,
        datos.dni,
        datos.correo,
        datos.password,
        datos.telefono

    ], callback);

};

module.exports = {

    obtenerClientes,
    obtenerClientePorId,
    obtenerClientePorCorreo,
    crearCliente

};