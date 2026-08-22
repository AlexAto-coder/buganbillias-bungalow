// ==========================================================
// REGISTRO DE CLIENTE
// ==========================================================

const registroForm =
    document.getElementById("registroForm");

const mensajeRegistro =
    document.getElementById("mensajeRegistro");

const btnRegistro =
    document.getElementById("btnRegistro");

const passwordInput =
    document.getElementById("password");

const btnMostrarPassword =
    document.getElementById("btnMostrarPassword");


// ==========================================================
// MOSTRAR / OCULTAR CONTRASEÑA
// ==========================================================

btnMostrarPassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        btnMostrarPassword.textContent = "🙈";

        btnMostrarPassword.setAttribute(
            "aria-label",
            "Ocultar contraseña"
        );

    } else {

        passwordInput.type = "password";

        btnMostrarPassword.textContent = "👁";

        btnMostrarPassword.setAttribute(
            "aria-label",
            "Mostrar contraseña"
        );

    }

});


// ==========================================================
// ENVIAR FORMULARIO
// ==========================================================

registroForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    // ======================================================
    // OBTENER DATOS
    // ======================================================

    const nombres =
        document
            .getElementById("nombres")
            .value
            .trim();

    const apellidos =
        document
            .getElementById("apellidos")
            .value
            .trim();

    const dni =
        document
            .getElementById("dni")
            .value
            .trim();

    const correo =
        document
            .getElementById("correo")
            .value
            .trim();

    const telefono =
        document
            .getElementById("telefono")
            .value
            .trim();

    const password =
        passwordInput.value;


    // ======================================================
    // LIMPIAR MENSAJE
    // ======================================================

    mensajeRegistro.textContent = "";


    // ======================================================
    // VALIDAR DNI
    // ======================================================

    if (!/^\d{8}$/.test(dni)) {

        mensajeRegistro.textContent =
            "El DNI debe tener exactamente 8 dígitos.";

        return;
    }


    // ======================================================
    // VALIDAR TELÉFONO
    // ======================================================

    if (!/^9\d{8}$/.test(telefono)) {

        mensajeRegistro.textContent =
            "El teléfono debe tener 9 dígitos y comenzar con 9.";

        return;
    }


    // ======================================================
    // VALIDAR CONTRASEÑA
    // ======================================================

    if (password.length < 8) {

        mensajeRegistro.textContent =
            "La contraseña debe tener al menos 8 caracteres.";

        return;
    }


    // ======================================================
    // DESACTIVAR BOTÓN
    // ======================================================

    btnRegistro.disabled = true;

    btnRegistro.textContent =
        "Registrando...";


    try {

        // ==================================================
        // ENVIAR AL BACKEND
        // ==================================================

        const respuesta =
            await fetch(
                `${CONFIG.api.baseURL}/clientes`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        nombres,
                        apellidos,
                        dni,
                        correo,
                        password,
                        telefono

                    })

                }
            );


        // ==================================================
        // LEER RESPUESTA
        // ==================================================

        const datos =
            await respuesta.json();


        // ==================================================
        // ERROR
        // ==================================================

        if (
            !respuesta.ok ||
            !datos.ok
        ) {

            mensajeRegistro.textContent =
                datos.mensaje ||
                "No se pudo registrar el cliente";

            btnRegistro.disabled = false;

            btnRegistro.textContent =
                "Crear cuenta";

            return;

        }


        // ==================================================
        // REGISTRO CORRECTO
        // ==================================================

        mensajeRegistro.textContent =
            "Cuenta creada correctamente.";


        // ==================================================
        // REDIRIGIR AL LOGIN
        // ==================================================

        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 1200);


    } catch (error) {

        console.error(
            "Error al registrar cliente:",
            error
        );


        mensajeRegistro.textContent =
            "No se pudo conectar con el servidor.";


        btnRegistro.disabled = false;

        btnRegistro.textContent =
            "Crear cuenta";

    }

});