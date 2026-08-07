// ==========================================================
// CONTROLADOR: CLIENTES
// ==========================================================

const Cliente = require("../models/clienteModel");

// Obtener todos los clientes
const listarClientes = (req, res) => {

    Cliente.obtenerClientes((error, resultados) => {

        if (error) {

            return res.status(500).json({
                ok: false,
                mensaje: "Error al obtener los clientes"
            });

        }

        res.json({
            ok: true,
            total: resultados.length,
            clientes: resultados
        });

    });

};

// Obtener cliente por ID
const obtenerCliente = (req, res) => {

    const { id } = req.params;

    Cliente.obtenerClientePorId(id, (error, resultados) => {

        if (error) {

            return res.status(500).json({
                ok: false,
                mensaje: "Error al obtener el cliente"
            });

        }

        if (resultados.length === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: "Cliente no encontrado"
            });

        }

        res.json({
            ok: true,
            cliente: resultados[0]
        });

    });

};

// Crear cliente
const registrarCliente = (req, res) => {

    Cliente.crearCliente(req.body, (error, resultado) => {

        if (error) {

            return res.status(500).json({
                ok: false,
                mensaje: "No se pudo registrar el cliente",
                error
            });

        }

        res.status(201).json({

            ok: true,
            mensaje: "Cliente registrado correctamente",
            id: resultado.insertId

        });

    });

};

module.exports = {

    listarClientes,
    obtenerCliente,
    registrarCliente

};