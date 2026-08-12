// ==========================================================
// RUTAS: RESERVAS
// ==========================================================

const express = require("express");
const router = express.Router();

const reservaController = require("../controllers/reservaController");
const validarJWT = require("../middleware/validarJWT");

// Crear una reserva
router.post(
    "/",
    validarJWT,
    reservaController.crearReserva
);

// Obtener mis reservas
router.get(
    "/mis-reservas",
    validarJWT,
    reservaController.misReservas
);

// Obtener una reserva específica
router.get(
    "/:id",
    validarJWT,
    reservaController.obtenerReserva
);

// Cancelar una reserva
router.delete(
    "/:id",
    validarJWT,
    reservaController.cancelarReserva
);

module.exports = router;