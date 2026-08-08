const jwt = require("jsonwebtoken");

const validarJWT = (req, res, next) => {

    // Leer el token del encabezado Authorization
    const authHeader = req.header("Authorization");

    if (!authHeader) {

        return res.status(401).json({
            ok: false,
            mensaje: "Token no proporcionado"
        });

    }

    // Debe venir como: Bearer xxxxxxxxx
    const token = authHeader.replace("Bearer ", "");

    try {

        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Guardar los datos del usuario en la petición
        req.usuario = payload;

        next();

    } catch (error) {

        return res.status(401).json({
            ok: false,
            mensaje: "Token inválido"
        });

    }

};

module.exports = validarJWT;