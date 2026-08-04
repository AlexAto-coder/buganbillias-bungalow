const express = require("express");

const router = express.Router();

const {
    listarHabitaciones
} = require("../controllers/habitacionController");

router.get("/", listarHabitaciones);

module.exports = router;