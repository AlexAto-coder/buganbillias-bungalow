// ==========================================================
// RUTAS: CLIENTES
// ==========================================================

const express = require("express");

const router = express.Router();

const clienteController =
    require("../controllers/clienteController");

const validarJWT =
    require("../middleware/validarJWT");


// ==========================================================
// OBTENER TODOS LOS CLIENTES
// ==========================================================

router.get(
    "/",
    validarJWT,
    clienteController.listarClientes
);


// ==========================================================
// OBTENER PERFIL DEL CLIENTE AUTENTICADO
// ==========================================================

router.get(
    "/perfil",
    validarJWT,
    clienteController.obtenerPerfil
);


// ==========================================================
// OBTENER CLIENTE POR ID
// ==========================================================

router.get(
    "/:id",
    validarJWT,
    clienteController.obtenerCliente
);


// ==========================================================
// REGISTRAR CLIENTE
// ==========================================================

router.post(
    "/",
    clienteController.registrarCliente
);


// ==========================================================
// LOGIN DE CLIENTE
// ==========================================================

router.post(
    "/login",
    clienteController.loginCliente
);


module.exports = router;