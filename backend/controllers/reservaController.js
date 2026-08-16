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


    // ======================================================
    // CLIENTE DESDE EL JWT
    // ======================================================

    const cliente_id = req.usuario.id;


    // ======================================================
    // VALIDAR DATOS OBLIGATORIOS
    // ======================================================

    if (
        habitacion_id === undefined ||
        habitacion_id === null ||
        !fecha_ingreso ||
        !fecha_salida ||
        personas === undefined ||
        personas === null
    ) {

        return res.status(400).json({
            ok: false,
            mensaje:
                "Todos los datos de la reserva son obligatorios"
        });

    }


    // ======================================================
    // VALIDAR HABITACIÓN
    // ======================================================

    const habitacionIdNumero =
        Number(habitacion_id);


    if (
        !Number.isInteger(habitacionIdNumero) ||
        habitacionIdNumero <= 0
    ) {

        return res.status(400).json({
            ok: false,
            mensaje:
                "La habitación seleccionada no es válida"
        });

    }


    // ======================================================
    // VALIDAR PERSONAS
    // ======================================================

    const personasNumero =
        Number(personas);


    if (
        !Number.isInteger(personasNumero) ||
        personasNumero <= 0
    ) {

        return res.status(400).json({
            ok: false,
            mensaje:
                "La cantidad de personas no es válida"
        });

    }


    // ======================================================
    // VALIDAR FORMATO DE FECHAS
    // ======================================================

    const formatoFecha =
        /^\d{4}-\d{2}-\d{2}$/;


    if (
        !formatoFecha.test(fecha_ingreso) ||
        !formatoFecha.test(fecha_salida)
    ) {

        return res.status(400).json({
            ok: false,
            mensaje:
                "Las fechas deben tener el formato YYYY-MM-DD"
        });

    }


    // ======================================================
    // VALIDAR FECHAS
    // ======================================================

    const ingreso =
        new Date(`${fecha_ingreso}T00:00:00Z`);

    const salida =
        new Date(`${fecha_salida}T00:00:00Z`);


    if (
        Number.isNaN(ingreso.getTime()) ||
        Number.isNaN(salida.getTime())
    ) {

        return res.status(400).json({
            ok: false,
            mensaje:
                "Las fechas no son válidas"
        });

    }


    // ======================================================
    // OBTENER FECHA ACTUAL
    // ======================================================

    const hoy =
        new Date();


    const hoyISO =
        hoy
            .toISOString()
            .split("T")[0];


    // ======================================================
    // NO PERMITIR FECHAS PASADAS
    // ======================================================

    if (fecha_ingreso < hoyISO) {

        return res.status(400).json({
            ok: false,
            mensaje:
                "La fecha de ingreso no puede ser anterior a hoy"
        });

    }


    // ======================================================
    // VALIDAR QUE LA SALIDA SEA POSTERIOR
    // ======================================================

    if (salida <= ingreso) {

        return res.status(400).json({
            ok: false,
            mensaje:
                "La fecha de salida debe ser posterior a la fecha de ingreso"
        });

    }


    // ======================================================
    // CALCULAR NÚMERO DE NOCHES
    // ======================================================

    const diferencia =
        salida - ingreso;


    const noches =
        Math.round(
            diferencia /
            (1000 * 60 * 60 * 24)
        );


    if (noches <= 0) {

        return res.status(400).json({
            ok: false,
            mensaje:
                "El número de noches no es válido"
        });

    }


    // ======================================================
    // BUSCAR HABITACIÓN
    // ======================================================

    Habitacion.obtenerHabitacionPorId(
        habitacionIdNumero,
        (error, habitaciones) => {

            // ==================================================
            // ERROR DE BASE DE DATOS
            // ==================================================

            if (error) {

                console.error(
                    "Error al consultar habitación:",
                    error
                );

                return res.status(500).json({
                    ok: false,
                    mensaje:
                        "Error al consultar la habitación"
                });

            }


            // ==================================================
            // HABITACIÓN NO EXISTE
            // ==================================================

            if (habitaciones.length === 0) {

                return res.status(404).json({
                    ok: false,
                    mensaje:
                        "Habitación no encontrada"
                });

            }


            const habitacion =
                habitaciones[0];


            // ==================================================
            // COMPROBAR ESTADO
            // ==================================================

            if (
                habitacion.estado !==
                "disponible"
            ) {

                return res.status(400).json({
                    ok: false,
                    mensaje:
                        "La habitación no está disponible"
                });

            }


            // ==================================================
            // COMPROBAR CAPACIDAD
            // ==================================================

            if (
                personasNumero >
                Number(habitacion.capacidad)
            ) {

                return res.status(400).json({
                    ok: false,
                    mensaje:
                        `La habitación tiene capacidad para ${habitacion.capacidad} personas`
                });

            }


            // ==================================================
            // COMPROBAR RESERVAS EXISTENTES
            // ==================================================

            Reserva.verificarDisponibilidad(
                habitacionIdNumero,
                fecha_ingreso,
                fecha_salida,
                (error, reservasExistentes) => {

                    // ==========================================
                    // ERROR DE DISPONIBILIDAD
                    // ==========================================

                    if (error) {

                        console.error(
                            "Error al verificar disponibilidad:",
                            error
                        );

                        return res.status(500).json({
                            ok: false,
                            mensaje:
                                "Error al verificar disponibilidad"
                        });

                    }


                    // ==========================================
                    // HABITACIÓN OCUPADA
                    // ==========================================

                    if (
                        reservasExistentes.length > 0
                    ) {

                        return res.status(409).json({
                            ok: false,
                            mensaje:
                                "La habitación no está disponible para esas fechas"
                        });

                    }


                    // ==========================================
                    // OBTENER PRECIO DESDE MYSQL
                    // ==========================================

                    const precio_noche =
                        Number(
                            habitacion.precio_noche
                        );


                    // ==========================================
                    // VALIDAR PRECIO
                    // ==========================================

                    if (
                        !Number.isFinite(
                            precio_noche
                        ) ||
                        precio_noche < 0
                    ) {

                        console.error(
                            "Precio inválido para habitación:",
                            habitacionIdNumero
                        );

                        return res.status(500).json({
                            ok: false,
                            mensaje:
                                "No se pudo determinar el precio de la habitación"
                        });

                    }


                    // ==========================================
                    // CALCULAR TOTAL EN EL BACKEND
                    // ==========================================

                    const total =
                        precio_noche *
                        noches;


                    // ==========================================
                    // GENERAR CÓDIGO
                    // ==========================================

                    const codigo =
                        "BUG-" +
                        Date.now()
                            .toString(36)
                            .toUpperCase();


                    // ==========================================
                    // DATOS QUE SE GUARDARÁN
                    // ==========================================

                    const datos = {

                        codigo,

                        cliente_id,

                        habitacion_id:
                            habitacionIdNumero,

                        fecha_ingreso,

                        fecha_salida,

                        noches,

                        personas:
                            personasNumero,

                        precio_noche,

                        total

                    };


                    // ==========================================
                    // CREAR RESERVA
                    // ==========================================

                    Reserva.crearReserva(
                        datos,
                        (error, resultado) => {

                            // ==================================
                            // ERROR AL INSERTAR
                            // ==================================

                            if (error) {

                                console.error(
                                    "Error al crear reserva:",
                                    error
                                );

                                return res.status(500).json({
                                    ok: false,
                                    mensaje:
                                        "No se pudo crear la reserva"
                                });

                            }


                            // ==================================
                            // RESERVA CREADA
                            // ==================================

                            return res.status(201).json({

                                ok: true,

                                mensaje:
                                    "Reserva creada correctamente",

                                reserva: {

                                    id:
                                        resultado.insertId,

                                    codigo,

                                    cliente_id,

                                    habitacion_id:
                                        habitacionIdNumero,

                                    fecha_ingreso,

                                    fecha_salida,

                                    noches,

                                    personas:
                                        personasNumero,

                                    precio_noche,

                                    total,

                                    estado:
                                        "pendiente"

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

    const cliente_id =
        req.usuario.id;


    Reserva.obtenerReservasPorCliente(
        cliente_id,
        (error, resultados) => {

            if (error) {

                console.error(
                    "Error al obtener reservas:",
                    error
                );

                return res.status(500).json({
                    ok: false,
                    mensaje:
                        "Error al obtener las reservas"
                });

            }


            return res.json({

                ok: true,

                total:
                    resultados.length,

                reservas:
                    resultados

            });

        }
    );

};


// ==========================================================
// OBTENER RESERVAS PARA EL CALENDARIO
// ==========================================================

const disponibilidad = (req, res) => {

    const {
        habitacion_id
    } = req.params;


    const habitacionIdNumero =
        Number(habitacion_id);


    if (
        !Number.isInteger(
            habitacionIdNumero
        ) ||
        habitacionIdNumero <= 0
    ) {

        return res.status(400).json({
            ok: false,
            mensaje:
                "La habitación seleccionada no es válida"
        });

    }


    Reserva.obtenerReservasCalendario(
        habitacionIdNumero,
        (error, resultados) => {

            if (error) {

                console.error(
                    "Error al obtener disponibilidad:",
                    error
                );

                return res.status(500).json({
                    ok: false,
                    mensaje:
                        "Error al obtener la disponibilidad"
                });

            }


            return res.json({

                ok: true,

                reservas:
                    resultados

            });

        }
    );

};


// ==========================================================
// OBTENER RESERVA POR ID
// ==========================================================

const obtenerReserva = (req, res) => {

    const {
        id
    } = req.params;


    const cliente_id =
        req.usuario.id;


    Reserva.obtenerReservaPorId(
        id,
        (error, resultados) => {

            if (error) {

                console.error(
                    "Error al obtener reserva:",
                    error
                );

                return res.status(500).json({
                    ok: false,
                    mensaje:
                        "Error al obtener la reserva"
                });

            }


            if (
                resultados.length === 0
            ) {

                return res.status(404).json({
                    ok: false,
                    mensaje:
                        "Reserva no encontrada"
                });

            }


            const reserva =
                resultados[0];


            // ==================================================
            // EL CLIENTE SOLO PUEDE VER SU PROPIA RESERVA
            // ==================================================

            if (
                Number(reserva.cliente_id) !==
                Number(cliente_id)
            ) {

                return res.status(403).json({
                    ok: false,
                    mensaje:
                        "No tienes permiso para consultar esta reserva"
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

    const {
        id
    } = req.params;


    const cliente_id =
        req.usuario.id;


    Reserva.obtenerReservaPorId(
        id,
        (error, resultados) => {

            if (error) {

                console.error(
                    "Error al consultar reserva:",
                    error
                );

                return res.status(500).json({
                    ok: false,
                    mensaje:
                        "Error al consultar la reserva"
                });

            }


            if (
                resultados.length === 0
            ) {

                return res.status(404).json({
                    ok: false,
                    mensaje:
                        "Reserva no encontrada"
                });

            }


            const reserva =
                resultados[0];


            // ==================================================
            // VERIFICAR PROPIETARIO
            // ==================================================

            if (
                Number(reserva.cliente_id) !==
                Number(cliente_id)
            ) {

                return res.status(403).json({
                    ok: false,
                    mensaje:
                        "No tienes permiso para cancelar esta reserva"
                });

            }


            // ==================================================
            // COMPROBAR SI YA ESTÁ CANCELADA
            // ==================================================

            if (
                reserva.estado ===
                "cancelado"
            ) {

                return res.status(400).json({
                    ok: false,
                    mensaje:
                        "La reserva ya está cancelada"
                });

            }


            // ==================================================
            // CANCELAR
            // ==================================================

            Reserva.cancelarReserva(
                id,
                (error, resultado) => {

                    if (error) {

                        console.error(
                            "Error al cancelar reserva:",
                            error
                        );

                        return res.status(500).json({
                            ok: false,
                            mensaje:
                                "No se pudo cancelar la reserva"
                        });

                    }


                    if (
                        resultado.affectedRows === 0
                    ) {

                        return res.status(400).json({
                            ok: false,
                            mensaje:
                                "La reserva ya está cancelada"
                        });

                    }


                    return res.json({

                        ok: true,

                        mensaje:
                            "Reserva cancelada correctamente"

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

    disponibilidad,

    obtenerReserva,

    cancelarReserva

};