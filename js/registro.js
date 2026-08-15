// ==========================================================
// REGISTRO DE CLIENTE
// ==========================================================

const registroForm = document.getElementById("registroForm");

const mensajeRegistro = document.getElementById("mensajeRegistro");

const btnRegistro = document.getElementById("btnRegistro");


registroForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const nombres =
        document.getElementById("nombres").value.trim();

    const apellidos =
        document.getElementById("apellidos").value.trim();

    const dni =
        document.getElementById("dni").value.trim();

    const correo =
        document.getElementById("correo").value.trim();

    const telefono =
        document.getElementById("telefono").value.trim();

    const password =
        document.getElementById("password").value;


    mensajeRegistro.textContent = "";

    btnRegistro.disabled = true;

    btnRegistro.textContent = "Registrando...";


    try {

        const respuesta = await fetch(
            `${CONFIG.api.baseURL}/clientes`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
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


        const datos = await respuesta.json();


        if (!respuesta.ok || !datos.ok) {

            mensajeRegistro.textContent =
                datos.mensaje ||
                "No se pudo registrar el cliente";

            btnRegistro.disabled = false;

            btnRegistro.textContent = "Crear cuenta";

            return;
        }


        mensajeRegistro.textContent =
            "Cuenta creada correctamente";


        // ==================================================
        // REDIRIGIR AL LOGIN
        // ==================================================

        setTimeout(() => {

            window.location.href = "login.html";

        }, 1200);


    } catch (error) {

        console.error(
            "Error al registrar cliente:",
            error
        );

        mensajeRegistro.textContent =
            "No se pudo conectar con el servidor.";

        btnRegistro.disabled = false;

        btnRegistro.textContent = "Crear cuenta";

    }

});