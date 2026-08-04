const Habitacion = require("../models/habitacionModel");

const listarHabitaciones = (req, res) => {

    Habitacion.obtenerHabitaciones((err, resultados) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                mensaje: "Error al obtener habitaciones"
            });

        }

        res.json({
            ok: true,
            total: resultados.length,
            habitaciones: resultados
});

    });

};

module.exports = {

    listarHabitaciones

};