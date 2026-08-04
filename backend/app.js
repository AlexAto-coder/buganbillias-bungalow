require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

require("./config/database");

app.use(cors());
app.use(express.json());

const habitacionRoutes = require("./routes/habitacionRoutes");

app.use("/api/habitaciones", habitacionRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);

});