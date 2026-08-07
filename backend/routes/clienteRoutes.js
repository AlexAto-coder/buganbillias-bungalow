// ==========================================================
// RUTAS: CLIENTES
// ==========================================================

const express = require("express");
const router = express.Router();

const clienteController = require("../controllers/clienteController");

router.get("/", clienteController.listarClientes);

router.get("/:id", clienteController.obtenerCliente);

router.post("/", clienteController.registrarCliente);

module.exports = router;