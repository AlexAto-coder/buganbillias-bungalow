// ==========================================================
// HABITACIONES
// ==========================================================

const listaHabitaciones = document.getElementById("listaHabitaciones");

// ==========================================================
// OCULTAR EN GITHUB PAGES
// ==========================================================

if (window.location.hostname === "alexato-coder.github.io") {

    document.getElementById("habitaciones").style.display = "none";

} else {

    cargarHabitaciones();

}

async function cargarHabitaciones() {

    try {

        const respuesta = await fetch("http://localhost:3000/api/habitaciones");

        const datos = await respuesta.json();

        listaHabitaciones.innerHTML = "";

        datos.habitaciones.forEach(habitacion => {

            listaHabitaciones.innerHTML += `

                <article class="card-habitacion">

                    <img src="${habitacion.imagen}" alt="${habitacion.nombre}">

                    <h3>${habitacion.nombre}</h3>

                    <p>${habitacion.descripcion}</p>

                    <p><strong>S/${habitacion.precio_noche}</strong> por noche</p>

                    <p>Capacidad: ${habitacion.capacidad} personas</p>

                </article>

            `;

        });

    } catch (error) {

        console.error("Error al cargar habitaciones:", error);

        listaHabitaciones.innerHTML = `
            <div class="mensaje-error">
                <h3>No se pudieron cargar las habitaciones</h3>
                <p>Intenta nuevamente en unos minutos.</p>
            </div>
        `;

    }
}

