// ==========================================================
// CONTROLADOR: CLIENTES
// ==========================================================

const Cliente = require("../models/clienteModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    const cliente_id = req.usuario.id;

    if (Number(id) !== cliente_id) {

        return res.status(403).json({
            ok: false,
            mensaje: "No tienes permiso para consultar este cliente"
        });

    }

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
const registrarCliente = async (req, res) => {

    try {

        const datos = { ...req.body };

        // Cifrar la contraseña
        datos.password = await bcrypt.hash(datos.password, 10);

        Cliente.crearCliente(datos, (error, resultado) => {

    if (error) {

        console.error("ERROR AL REGISTRAR CLIENTE:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "No se pudo registrar el cliente",
            error: error.message
        });

    }

    res.status(201).json({

        ok: true,
        mensaje: "Cliente registrado correctamente",
        id: resultado.insertId

    });

});

    } catch (error) {

        return res.status(500).json({
            ok: false,
            mensaje: "Error al cifrar la contraseña"
        });

    }

};

// ==========================================================
// LOGIN DE CLIENTE
// ==========================================================

const loginCliente = (req, res) => {

    const { correo, password } = req.body;

    Cliente.obtenerClientePorCorreo(correo, async (error, resultados) => {

        if (error) {

            return res.status(500).json({
                ok: false,
                mensaje: "Error del servidor"
            });

        }

        if (resultados.length === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: "Correo no registrado"
            });

        }

        const cliente = resultados[0];

        const passwordCorrecto = await bcrypt.compare(
            password,
            cliente.password
        );

        if (!passwordCorrecto) {

            return res.status(401).json({
                ok: false,
                mensaje: "Contraseña incorrecta"
            });

        }

       // Generar JWT
const token = jwt.sign(

    {
        id: cliente.id,
        correo: cliente.correo
    },

    process.env.JWT_SECRET,

    {
        expiresIn: "7d"
    }

);

// Respuesta
return res.json({

    ok: true,
    mensaje: "Inicio de sesión correcto",

    token,

    cliente: {

        id: cliente.id,
        nombres: cliente.nombres,
        correo: cliente.correo

             }

        });

    });

};

// ==========================================================
// EXPORTAR CONTROLADOR
// ==========================================================

module.exports = {
    listarClientes,
    obtenerCliente,
    registrarCliente,
    loginCliente
};