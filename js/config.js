// ======================================
// CONFIGURACIÓN GENERAL
// BUGANVILLIAS BUNGALOWS
// ======================================

const CONFIG = {

    api: {

        // ==================================
        // DETECTAR ENTORNO
        // ==================================

        baseURL:
            window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1"

                ? "http://localhost:3000/api"

                : "https://buganbillias-bungalow.onrender.com/api"

    },


    // ======================================
    // DATOS DEL HOTEL
    // ======================================

    hotel: {

        nombre: "Buganvillias Bungalows",

        slogan: "Comodidad, calma y mar.",

        ciudad: "Los Órganos",

        departamento: "Piura",

        pais: "Perú",

        telefono: "+51 999 999 999",

        email: "reservas@buganvillias.com",

        web: "www.buganvillias.com"

    },


    // ======================================
    // CONFIGURACIÓN DE RESERVAS
    // ======================================

    reservas: {

        moneda: "S/",

        checkIn: "14:00",

        checkOut: "12:00"

    }

};