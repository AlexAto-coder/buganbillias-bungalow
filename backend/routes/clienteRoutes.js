// ==========================================================
// RUTAS: CLIENTES
// ==========================================================

const express = require("express");
const router = express.Router();

const clienteController = require("../controllers/clienteController");
const validarJWT = require("../middleware/validarJWT");

// Obtener todos los clientes
router.get("/", validarJWT, clienteController.listarClientes);

// Obtener un cliente por ID
router.get("/:id", validarJWT, clienteController.obtenerCliente);

// Registrar cliente
router.post("/", clienteController.registrarCliente);

// ✅ Login de cliente
router.post("/login", clienteController.loginCliente);

module.exports = router;