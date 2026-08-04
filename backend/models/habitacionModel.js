// ==========================================================
// MODELO: HABITACIONES
// ==========================================================

const db = require("../config/database");

// Obtener todas las habitaciones
const obtenerHabitaciones = (callback) => {

    const sql = "SELECT * FROM habitaciones";

    db.query(sql, callback);

};

// Obtener una habitación por ID
const obtenerHabitacionPorId = (id, callback) => {

    const sql = "SELECT * FROM habitaciones WHERE id = ?";

    db.query(sql, [id], callback);

};

// Crear una habitación
const crearHabitacion = (datos, callback) => {

    const sql = `
        INSERT INTO habitaciones
        (nombre, descripcion, precio_noche, capacidad, imagen, estado)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        datos.nombre,
        datos.descripcion,
        datos.precio_noche,
        datos.capacidad,
        datos.imagen,
        datos.estado
    ], callback);

};

module.exports = {

    obtenerHabitaciones,
    obtenerHabitacionPorId,
    crearHabitacion

};