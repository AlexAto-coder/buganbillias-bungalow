// ==========================================================
// CONTROLADOR: RESERVAS
// ==========================================================

const Reserva = require("../models/reservaModel");
const Habitacion = require("../models/habitacionModel");

// ==========================================================
// CREAR RESERVA
// ==========================================================

const crearReserva = (req, res) => {

    const {
        habitacion_id,
        fecha_ingreso,
        fecha_salida,
        personas
    } = req.body;

    // El cliente viene del JWT
    const cliente_id = req.usuario.id;


    // ------------------------------------------------------
    // VALIDAR DATOS
    // ------------------------------------------------------

    if (
        !habitacion_id ||
        !fecha_ingreso ||
        !fecha_salida ||
        !personas
    ) {

        return res.status(400).json({
            ok: false,
            mensaje: "Todos los datos de la reserva son obligatorios"
        });

    }


    // ------------------------------------------------------
    // VALIDAR FECHAS
    // ------------------------------------------------------

    const ingreso = new Date(fecha_ingreso);
    const salida = new Date(fecha_salida);

    if (
        Number.isNaN(ingreso.getTime()) ||
        Number.isNaN(salida.getTime())
    ) {

        return res.status(400).json({
            ok: false,
            mensaje: "Las fechas no son válidas"
        });

    }


    if (salida <= ingreso) {

        return res.status(400).json({
            ok: false,
            mensaje: "La fecha de salida debe ser posterior a la fecha de ingreso"
        });

    }


    // ------------------------------------------------------
    // CALCULAR NÚMERO DE NOCHES
    // ------------------------------------------------------

    const diferencia = salida - ingreso;

    const noches = Math.ceil(
        diferencia / (1000 * 60 * 60 * 24)
    );


    // ------------------------------------------------------
    // BUSCAR HABITACIÓN
    // ------------------------------------------------------

    Habitacion.obtenerHabitacionPorId(
        habitacion_id,
        (error, habitaciones) => {

            if (error) {

                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al consultar la habitación"
                });

            }


            if (habitaciones.length === 0) {

                return res.status(404).json({
                    ok: false,
                    mensaje: "Habitación no encontrada"
                });

            }


            const habitacion = habitaciones[0];


            // --------------------------------------------------
            // COMPROBAR ESTADO DE LA HABITACIÓN
            // --------------------------------------------------

            if (habitacion.estado !== "disponible") {

                return res.status(400).json({
                    ok: false,
                    mensaje: "La habitación no está disponible"
                });

            }


            // --------------------------------------------------
            // COMPROBAR CAPACIDAD
            // --------------------------------------------------

            if (Number(personas) > habitacion.capacidad) {

                return res.status(400).json({
                    ok: false,
                    mensaje: `La habitación tiene capacidad para ${habitacion.capacidad} personas`
                });

            }


            // --------------------------------------------------
            // COMPROBAR RESERVAS EXISTENTES
            // --------------------------------------------------

            Reserva.verificarDisponibilidad(
                habitacion_id,
                fecha_ingreso,
                fecha_salida,
                (error, reservasExistentes) => {

                    if (error) {

                        return res.status(500).json({
                            ok: false,
                            mensaje: "Error al verificar disponibilidad"
                        });

                    }


                    if (reservasExistentes.length > 0) {

                        return res.status(409).json({
                            ok: false,
                            mensaje: "La habitación no está disponible para esas fechas"
                        });

                    }


                    // --------------------------------------------------
                    // CALCULAR PRECIO
                    // --------------------------------------------------

                    const precio_noche = Number(
                        habitacion.precio_noche
                    );

                    const total = precio_noche * noches;


                    // --------------------------------------------------
                    // GENERAR CÓDIGO DE RESERVA
                    // --------------------------------------------------

                    const codigo =
                        "BUG-" +
                        Date.now().toString(36).toUpperCase();


                    // --------------------------------------------------
                    // CREAR RESERVA
                    // --------------------------------------------------

                    const datos = {

                        codigo,
                        cliente_id,
                        habitacion_id,
                        fecha_ingreso,
                        fecha_salida,
                        noches,
                        personas,
                        precio_noche,
                        total

                    };


                    Reserva.crearReserva(
                        datos,
                        (error, resultado) => {

                            if (error) {

                                return res.status(500).json({
                                    ok: false,
                                    mensaje: "No se pudo crear la reserva",
                                    error
                                });

                            }


                            return res.status(201).json({

                                ok: true,
                                mensaje: "Reserva creada correctamente",

                                reserva: {

                                    id: resultado.insertId,
                                    codigo,
                                    cliente_id,
                                    habitacion_id,
                                    fecha_ingreso,
                                    fecha_salida,
                                    noches,
                                    personas,
                                    precio_noche,
                                    total,
                                    estado: "pendiente"

                                }

                            });

                        }
                    );

                }
            );

        }
    );

};


// ==========================================================
// OBTENER MIS RESERVAS
// ==========================================================

const misReservas = (req, res) => {

    const cliente_id = req.usuario.id;

    Reserva.obtenerReservasPorCliente(
        cliente_id,
        (error, resultados) => {

            if (error) {

                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al obtener las reservas"
                });

            }

            return res.json({
                ok: true,
                total: resultados.length,
                reservas: resultados
            });

        }
    );

};


// ==========================================================
// OBTENER RESERVA POR ID
// ==========================================================

const obtenerReserva = (req, res) => {

    const { id } = req.params;
    const cliente_id = req.usuario.id;

    Reserva.obtenerReservaPorId(
        id,
        (error, resultados) => {

            if (error) {

                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al obtener la reserva"
                });

            }


            if (resultados.length === 0) {

                return res.status(404).json({
                    ok: false,
                    mensaje: "Reserva no encontrada"
                });

            }


            const reserva = resultados[0];


            // El cliente solo puede consultar sus propias reservas
            if (reserva.cliente_id !== cliente_id) {

                return res.status(403).json({
                    ok: false,
                    mensaje: "No tienes permiso para consultar esta reserva"
                });

            }


            return res.json({
                ok: true,
                reserva
            });

        }
    );

};


// ==========================================================
// CANCELAR RESERVA
// ==========================================================

const cancelarReserva = (req, res) => {

    const { id } = req.params;
    const cliente_id = req.usuario.id;


    Reserva.obtenerReservaPorId(
        id,
        (error, resultados) => {

            if (error) {

                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al consultar la reserva"
                });

            }


            if (resultados.length === 0) {

                return res.status(404).json({
                    ok: false,
                    mensaje: "Reserva no encontrada"
                });

            }


            const reserva = resultados[0];


            if (reserva.cliente_id !== cliente_id) {

                return res.status(403).json({
                    ok: false,
                    mensaje: "No tienes permiso para cancelar esta reserva"
                });

            }


            if (reserva.estado === "cancelado") {

                return res.status(400).json({
                    ok: false,
                    mensaje: "La reserva ya está cancelada"
                });

            }


            Reserva.cancelarReserva(
               id,
                (error, resultado) => {

                if (error) {

                    return res.status(500).json({
                    ok: false,
                    mensaje: "No se pudo cancelar la reserva"
            });

        }

        if (resultado.affectedRows === 0) {

            return res.status(400).json({
                ok: false,
                mensaje: "La reserva ya está cancelada"
            });

        }

        return res.json({
            ok: true,
            mensaje: "Reserva cancelada correctamente"
                    });

                }
            );

        }
    );

};


// ==========================================================
// EXPORTAR CONTROLADOR
// ==========================================================

module.exports = {
    crearReserva,
    misReservas,
    obtenerReserva,
    cancelarReserva
};