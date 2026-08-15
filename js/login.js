// ==========================================================
// LOGIN DE CLIENTE
// ==========================================================

const loginForm = document.getElementById("loginForm");

const mensajeLogin = document.getElementById("mensajeLogin");

const btnLogin = document.getElementById("btnLogin");


loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const correo = document.getElementById("correo").value.trim();

    const password = document.getElementById("password").value;


    mensajeLogin.textContent = "";

    btnLogin.disabled = true;

    btnLogin.textContent = "Iniciando sesión...";


    try {

        const respuesta = await fetch(
            `${CONFIG.api.baseURL}/clientes/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    correo,
                    password
                })
            }
        );


        const datos = await respuesta.json();


        if (!respuesta.ok || !datos.ok) {

            mensajeLogin.textContent =
                datos.mensaje || "No se pudo iniciar sesión";

            btnLogin.disabled = false;

            btnLogin.textContent = "Iniciar sesión";

            return;
        }


        // ==================================================
        // GUARDAR SESIÓN
        // ==================================================

        localStorage.setItem(
            "token",
            datos.token
        );


        localStorage.setItem(
            "cliente",
            JSON.stringify(datos.cliente)
        );


        mensajeLogin.textContent =
            "Inicio de sesión correcto";


        // ==================================================
        // REDIRECCIÓN
        // ==================================================

        setTimeout(() => {

            window.location.href = "index.html";

        }, 800);


    } catch (error) {

        console.error(
            "Error al iniciar sesión:",
            error
        );

        mensajeLogin.textContent =
            "No se pudo conectar con el servidor.";

        btnLogin.disabled = false;

        btnLogin.textContent = "Iniciar sesión";

    }

});