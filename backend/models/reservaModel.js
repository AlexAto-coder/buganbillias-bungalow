// ==========================================================
// MODELO: RESERVAS
// ==========================================================

const db = require("../config/database");

// ==========================================================
// CREAR RESERVA
// ==========================================================

const crearReserva = (datos, callback) => {

    const {
        codigo,
        cliente_id,
        habitacion_id,
        fecha_ingreso,
        fecha_salida,
        noches,
        personas,
        precio_noche,
        total
    } = datos;

    const sql = `
        INSERT INTO reservas
        (
            codigo,
            cliente_id,
            habitacion_id,
            fecha_ingreso,
            fecha_salida,
            noches,
            personas,
            precio_noche,
            total
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        codigo,
        cliente_id,
        habitacion_id,
        fecha_ingreso,
        fecha_salida,
        noches,
        personas,
        precio_noche,
        total
    ], callback);
};


// ==========================================================
// OBTENER RESERVAS DE UN CLIENTE
// ==========================================================

const obtenerReservasPorCliente = (cliente_id, callback) => {

    const sql = `
        SELECT
            r.id,
            r.codigo,
            r.fecha_ingreso,
            r.fecha_salida,
            r.noches,
            r.personas,
            r.precio_noche,
            r.total,
            r.estado,
            r.created_at,

            h.id AS habitacion_id,
            h.nombre AS habitacion,
            h.imagen AS imagen_habitacion

        FROM reservas r

        INNER JOIN habitaciones h
            ON r.habitacion_id = h.id

        WHERE r.cliente_id = ?

        ORDER BY r.created_at DESC
    `;

    db.query(sql, [cliente_id], callback);
};


// ==========================================================
// OBTENER UNA RESERVA POR ID
// ==========================================================

const obtenerReservaPorId = (id, callback) => {

    const sql = `
        SELECT
            r.id,
            r.codigo,
            r.cliente_id,
            r.habitacion_id,
            r.fecha_ingreso,
            r.fecha_salida,
            r.noches,
            r.personas,
            r.precio_noche,
            r.total,
            r.estado,
            r.created_at,

            h.nombre AS habitacion,
            h.imagen AS imagen_habitacion

        FROM reservas r

        INNER JOIN habitaciones h
            ON r.habitacion_id = h.id

        WHERE r.id = ?
    `;

    db.query(sql, [id], callback);
};


// ==========================================================
// CANCELAR RESERVA
// ==========================================================

const cancelarReserva = (id, callback) => {

     const sql = `
        UPDATE reservas
        SET estado = 'cancelado'
        WHERE id = ?
        AND estado <> 'cancelado'
    `;

    db.query(sql, [id], callback);
};

// ==========================================================
// VERIFICAR DISPONIBILIDAD DE HABITACIÓN
// ==========================================================

const verificarDisponibilidad = (
    habitacion_id,
    fecha_ingreso,
    fecha_salida,
    callback
) => {

    const sql = `
        SELECT id
        FROM reservas
        WHERE habitacion_id = ?
        AND estado IN ('pendiente', 'pagado')
        AND fecha_ingreso < ?
        AND fecha_salida > ?
    `;

    db.query(
        sql,
        [
            habitacion_id,
            fecha_salida,
            fecha_ingreso
        ],
        callback
    );
};

// ==========================================================
// EXPORTAR FUNCIONES
// ==========================================================

module.exports = {
    crearReserva,
    obtenerReservasPorCliente,
    obtenerReservaPorId,
    cancelarReserva,
    verificarDisponibilidad
};