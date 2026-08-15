// ==========================================================
// RESERVAS
// ==========================================================


// ==========================================================
// ELEMENTOS DEL DOM
// ==========================================================

const formReserva = document.getElementById("formReserva");

const fechaInicio = document.getElementById("fechaInicio");
const fechaFin = document.getElementById("fechaFin");

const mensajeReserva =
    document.getElementById("mensajeReserva");

const calendar =
    document.getElementById("calendar");

const btnConfirmar =
    document.getElementById("btnConfirmar");

const nombre =
    document.getElementById("nombre");

const email =
    document.getElementById("email");

const telefono =
    document.getElementById("telefono");

const personas =
    document.getElementById("personas");

const habitacion =
    document.getElementById("habitacion");


// ==========================================================
// CALENDARIO
// ==========================================================

let currentYear =
    new Date().getFullYear();

let currentMonth =
    new Date().getMonth();


// ==========================================================
// HABITACIONES
// ==========================================================

let habitacionesDisponibles = [];

let habitacionSeleccionada = null;


// ==========================================================
// GENERAR CÓDIGO DE RESERVA
// ==========================================================

function generarCodigo() {

    const ahora = new Date();

    return "BB-" +
        ahora.getFullYear() +
        String(
            ahora.getMonth() + 1
        ).padStart(2, "0") +
        String(
            ahora.getDate()
        ).padStart(2, "0") +
        "-" +
        Math.floor(
            Math.random() * 900 + 100
        );

}


// ==========================================================
// RESUMEN
// ==========================================================

const rNombre =
    document.getElementById("rNombre");

const rCorreo =
    document.getElementById("rCorreo");

const codigoReserva =
    document.getElementById("codigoReserva");

const rIngreso =
    document.getElementById("rIngreso");

const rSalida =
    document.getElementById("rSalida");

const rPersonas =
    document.getElementById("rPersonas");

const rNoches =
    document.getElementById("rNoches");

const rPrecio =
    document.getElementById("rPrecio");

const rTotal =
    document.getElementById("rTotal");


// ==========================================================
// CARGAR HABITACIONES DESDE LA API
// ==========================================================

async function cargarHabitacionesReserva() {

    try {

        const respuesta = await fetch(
            `${CONFIG.api.baseURL}/habitaciones`
        );

        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                datos.mensaje ||
                "No se pudieron cargar las habitaciones"
            );

        }


        habitacionesDisponibles =
            datos.habitaciones || [];


        habitacion.innerHTML = `
            <option value="">
                Seleccione una habitación
            </option>
        `;


        habitacionesDisponibles.forEach(
            habitacionData => {

                const opcion =
                    document.createElement("option");


                opcion.value =
                    habitacionData.id;


                const precio =
                    Number(
                        habitacionData.precio_noche
                    );


                opcion.textContent =
                    `${habitacionData.nombre} - S/${precio.toFixed(2)} por noche`;


                habitacion.appendChild(
                    opcion
                );

            }
        );


        if (
            habitacionesDisponibles.length === 0
        ) {

            habitacion.innerHTML = `
                <option value="">
                    No hay habitaciones disponibles
                </option>
            `;

        }

    } catch (error) {

        console.error(
            "Error al cargar habitaciones:",
            error
        );


        habitacion.innerHTML = `
            <option value="">
                Error al cargar habitaciones
            </option>
        `;

    }

}


// ==========================================================
// OBTENER HABITACIÓN SELECCIONADA
// ==========================================================

function obtenerHabitacionSeleccionada() {

    const id =
        Number(habitacion.value);


    if (!id) {

        habitacionSeleccionada =
            null;

        return null;

    }


    habitacionSeleccionada =
        habitacionesDisponibles.find(
            habitacionData =>
                Number(habitacionData.id) === id
        );


    return habitacionSeleccionada;

}


// ==========================================================
// ACTUALIZAR RESUMEN
// ==========================================================

function actualizarResumen() {

    const nombreCliente =
        nombre.value;

    const ingreso =
        fechaInicio.value;

    const salida =
        fechaFin.value;

    const cantidadPersonas =
        personas.value;

    const correoCliente =
        email.value;


    // ======================================================
    // DATOS BÁSICOS
    // ======================================================

    if (codigoReserva) {

        codigoReserva.textContent =
            generarCodigo();

    }


    if (rCorreo) {

        rCorreo.textContent =
            correoCliente || "-";

    }


    if (rNombre) {

        rNombre.textContent =
            nombreCliente || "-";

    }


    if (rIngreso) {

        rIngreso.textContent =
            ingreso || "-";

    }


    if (rSalida) {

        rSalida.textContent =
            salida || "-";

    }


    if (rPersonas) {

        rPersonas.textContent =
            cantidadPersonas || "-";

    }


    // ======================================================
    // HABITACIÓN
    // ======================================================

    const habitacionData =
        obtenerHabitacionSeleccionada();


    if (!habitacionData) {

        if (rNoches) {

            rNoches.textContent =
                "0";

        }

        if (rPrecio) {

            rPrecio.textContent =
                "S/0.00";

        }

        if (rTotal) {

            rTotal.textContent =
                "S/0.00";

        }

        return;

    }


    // ======================================================
    // CALCULAR NOCHES
    // ======================================================

    if (!ingreso || !salida) {

        if (rNoches) {

            rNoches.textContent =
                "0";

        }

        if (rPrecio) {

            rPrecio.textContent =
                "S/0.00";

        }

        if (rTotal) {

            rTotal.textContent =
                "S/0.00";

        }

        return;

    }


    const fecha1 =
        new Date(
            ingreso + "T00:00:00"
        );


    const fecha2 =
        new Date(
            salida + "T00:00:00"
        );


    const milisegundosPorDia =
        1000 * 60 * 60 * 24;


    const noches =
        Math.round(
            (fecha2 - fecha1) /
            milisegundosPorDia
        );


    if (noches <= 0) {

        if (rNoches) {

            rNoches.textContent =
                "0";

        }

        if (rPrecio) {

            rPrecio.textContent =
                "S/0.00";

        }

        if (rTotal) {

            rTotal.textContent =
                "S/0.00";

        }

        return;

    }


    const precioNoche =
        Number(
            habitacionData.precio_noche
        );


    const total =
        noches * precioNoche;


    if (rNoches) {

        rNoches.textContent =
            noches;

    }


    if (rPrecio) {

        rPrecio.textContent =
            `S/${precioNoche.toFixed(2)}`;

    }


    if (rTotal) {

        rTotal.textContent =
            `S/${total.toFixed(2)}`;

    }

}


// ==========================================================
// RESERVAS TEMPORALES
// ==========================================================
// POR AHORA mantenemos localStorage.
// Más adelante lo reemplazaremos por la API.
// ==========================================================

const RESERVAS_KEY =
    "reservasBuganvillias";


const reservasIniciales = [

    {
        inicio: "2026-02-10",
        fin: "2026-02-14"
    },

    {
        inicio: "2026-02-20",
        fin: "2026-02-22"
    }

];


let reservasExistentes =
    JSON.parse(
        localStorage.getItem(
            RESERVAS_KEY
        )
    ) || reservasIniciales;


// ==========================================================
// GUARDAR RESERVAS
// ==========================================================

function guardarReservas() {

    localStorage.setItem(
        RESERVAS_KEY,
        JSON.stringify(
            reservasExistentes
        )
    );

}


if (
    !localStorage.getItem(
        RESERVAS_KEY
    )
) {

    guardarReservas();

}


// ==========================================================
// NORMALIZAR FECHA
// ==========================================================

function normalizarFecha(fecha) {

    if (
        typeof fecha === "string"
    ) {

        const [
            anio,
            mes,
            dia
        ] =
            fecha
                .split("-")
                .map(Number);


        return new Date(
            anio,
            mes - 1,
            dia
        );

    }


    return new Date(
        fecha.getFullYear(),
        fecha.getMonth(),
        fecha.getDate()
    );

}


// ==========================================================
// BLOQUEAR FECHAS PASADAS
// ==========================================================

function establecerMinFecha() {

    const hoy =
        normalizarFecha(
            new Date()
        );


    const hoyISO =
        hoy
            .toISOString()
            .split("T")[0];


    fechaInicio.min =
        hoyISO;

    fechaFin.min =
        hoyISO;

}


// ==========================================================
// FECHA RESERVADA
// ==========================================================

function fechaEstaReservada(fecha) {

    const f =
        normalizarFecha(fecha);


    return reservasExistentes.some(
        reserva => {

            const inicio =
                normalizarFecha(
                    reserva.inicio
                );


            const fin =
                normalizarFecha(
                    reserva.fin
                );


            // El día de salida queda libre

            return (
                f >= inicio &&
                f < fin
            );

        }
    );

}


// ==========================================================
// DISPONIBILIDAD DEL RANGO
// ==========================================================

function rangoDisponible(
    inicio,
    fin
) {

    const i =
        normalizarFecha(inicio);

    const f =
        normalizarFecha(fin);


    return !reservasExistentes.some(
        reserva => {

            const rInicio =
                normalizarFecha(
                    reserva.inicio
                );


            const rFin =
                normalizarFecha(
                    reserva.fin
                );


            return (
                i < rFin &&
                f > rInicio
            );

        }
    );

}


// ==========================================================
// VALIDAR DISPONIBILIDAD
// ==========================================================

function validarDisponibilidad() {

    btnConfirmar.disabled =
        true;


    mensajeReserva.textContent =
        "";


    if (
        !habitacion.value
    ) {

        if (
            fechaInicio.value &&
            fechaFin.value
        ) {

            mensajeReserva.textContent =
                "⚠️ Selecciona una habitación.";

            mensajeReserva.style.color =
                "orange";

        }

        return;

    }


    if (
        !fechaInicio.value ||
        !fechaFin.value
    ) {

        return;

    }


    const hoy =
        normalizarFecha(
            new Date()
        );


    const inicio =
        normalizarFecha(
            fechaInicio.value
        );


    const fin =
        normalizarFecha(
            fechaFin.value
        );


    // ======================================================
    // FECHA PASADA
    // ======================================================

    if (
        inicio < hoy
    ) {

        mensajeReserva.textContent =
            "❌ No puedes reservar fechas pasadas.";

        mensajeReserva.style.color =
            "red";

        return;

    }


    // ======================================================
    // FECHAS INCORRECTAS
    // ======================================================

    if (
        fin <= inicio
    ) {

        mensajeReserva.textContent =
            "⚠️ La fecha de salida debe ser posterior a la fecha de ingreso.";

        mensajeReserva.style.color =
            "orange";

        return;

    }


    // ======================================================
    // RANGO OCUPADO
    // ======================================================

    if (
        !rangoDisponible(
            inicio,
            fin
        )
    ) {

        mensajeReserva.textContent =
            "❌ No hay disponibilidad para ese rango de fechas.";

        mensajeReserva.style.color =
            "red";

        return;

    }


    // ======================================================
    // CALCULAR NOCHES
    // ======================================================

    const noches =
        (fin - inicio) /
        (1000 * 60 * 60 * 24);


    mensajeReserva.innerHTML = `
        ✅ <strong>Disponibilidad confirmada</strong><br>
        Noches: ${noches}
    `;


    mensajeReserva.style.color =
        "green";


    btnConfirmar.disabled =
        false;


    actualizarResumen();

}


// ==========================================================
// CAMBIO DE HABITACIÓN
// ==========================================================

habitacion.addEventListener(
    "change",
    () => {

        actualizarResumen();

        validarDisponibilidad();

    }
);


// ==========================================================
// CAMBIO FECHA INGRESO
// ==========================================================

fechaInicio.addEventListener(
    "change",
    () => {

        const inicio =
            normalizarFecha(
                fechaInicio.value
            );


        const hoy =
            normalizarFecha(
                new Date()
            );


        if (
            inicio < hoy ||
            fechaEstaReservada(
                inicio
            )
        ) {

            alert(
                "❌ Fecha no disponible."
            );


            fechaInicio.value =
                "";


            btnConfirmar.disabled =
                true;


            actualizarResumen();

            return;

        }


        fechaFin.min =
            fechaInicio.value;


        actualizarResumen();

        validarDisponibilidad();

    }
);


// ==========================================================
// CAMBIO FECHA SALIDA
// ==========================================================

fechaFin.addEventListener(
    "change",
    () => {

        const fin =
            normalizarFecha(
                fechaFin.value
            );


        if (
            fechaEstaReservada(
                fin
            )
        ) {

            alert(
                "❌ Fecha no disponible."
            );


            fechaFin.value =
                "";


            btnConfirmar.disabled =
                true;


            actualizarResumen();

            return;

        }


        actualizarResumen();

        validarDisponibilidad();

    }
);


// // ==========================================================
// CONFIRMAR RESERVA
// ==========================================================
// ENVIAR RESERVA AL BACKEND
// ==========================================================

formReserva.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();


        // ==================================================
        // VALIDAR BOTÓN
        // ==================================================

        if (btnConfirmar.disabled) {

            return;

        }


        // ==================================================
        // OBTENER TOKEN
        // ==================================================

        const token =
            localStorage.getItem("token");


        if (!token) {

            mensajeReserva.textContent =
                "⚠️ Debes iniciar sesión para realizar una reserva.";

            mensajeReserva.style.color =
                "red";

            return;

        }


        // ==================================================
        // OBTENER HABITACIÓN
        // ==================================================

        const habitacionData =
            obtenerHabitacionSeleccionada();


        if (!habitacionData) {

            mensajeReserva.textContent =
                "❌ Debes seleccionar una habitación.";

            mensajeReserva.style.color =
                "red";

            return;

        }


        // ==================================================
        // OBTENER FECHAS
        // ==================================================

        const fechaIngreso =
            fechaInicio.value;

        const fechaSalida =
            fechaFin.value;


        const inicio =
            normalizarFecha(
                fechaIngreso
            );

        const fin =
            normalizarFecha(
                fechaSalida
            );


        // ==================================================
        // CALCULAR NOCHES
        // ==================================================

        const noches =
            (fin - inicio) /
            (1000 * 60 * 60 * 24);


        // ==================================================
        // OBTENER PRECIO DE LA HABITACIÓN
        // ==================================================

        const precioNoche =
            Number(
                habitacionData.precio_noche
            );


        const total =
            noches * precioNoche;


        // ==================================================
        // DESACTIVAR BOTÓN
        // ==================================================

        btnConfirmar.disabled =
            true;

        btnConfirmar.textContent =
            "Registrando reserva...";


        try {

            // ==================================================
            // ENVIAR AL BACKEND
            // ==================================================

            const respuesta =
                await fetch(
                    `${CONFIG.api.baseURL}/reservas`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            habitacion_id:
                                Number(
                                    habitacionData.id
                                ),

                            fecha_ingreso:
                                fechaIngreso,

                            fecha_salida:
                                fechaSalida,

                            noches:
                                noches,

                            personas:
                                Number(
                                    personas.value
                                ),

                            precio_noche:
                                precioNoche,

                            total:
                                total

                        })

                    }
                );


            // ==================================================
            // LEER RESPUESTA
            // ==================================================

            const datos =
                await respuesta.json();


            // ==================================================
            // ERROR DEL BACKEND
            // ==================================================

            if (
                !respuesta.ok ||
                !datos.ok
            ) {

                mensajeReserva.textContent =
                    datos.mensaje ||
                    "No se pudo crear la reserva.";

                mensajeReserva.style.color =
                    "red";


                btnConfirmar.disabled =
                    false;

                btnConfirmar.textContent =
                    "Confirmar reserva";


                console.error(
                    "Error del servidor:",
                    datos
                );


                return;

            }


            // ==================================================
            // RESERVA CREADA CORRECTAMENTE
            // ==================================================

            mensajeReserva.innerHTML = `
                🎉 <strong>Reserva creada correctamente.</strong><br>
                Código: ${
                    datos.codigo ||
                    datos.reserva?.codigo ||
                    "Generado correctamente"
                }
            `;


            mensajeReserva.style.color =
                "green";


            // ==================================================
            // LIMPIAR FORMULARIO
            // ==================================================

            formReserva.reset();


            btnConfirmar.disabled =
                true;

            btnConfirmar.textContent =
                "Confirmar reserva";


            actualizarResumen();


            console.log(
                "Reserva creada:",
                datos
            );


        } catch (error) {

            console.error(
                "Error al crear reserva:",
                error
            );


            mensajeReserva.textContent =
                "No se pudo conectar con el servidor.";

            mensajeReserva.style.color =
                "red";


            btnConfirmar.disabled =
                false;

            btnConfirmar.textContent =
                "Confirmar reserva";

        }

    }
);

// ==========================================================
// FECHA BLOQUEADA
// ==========================================================

function fechaBloqueada(fecha) {

    const f =
        normalizarFecha(
            fecha
        );


    return reservasExistentes.some(
        reserva => {

            const inicio =
                normalizarFecha(
                    reserva.inicio
                );


            const fin =
                normalizarFecha(
                    reserva.fin
                );


            return (
                f >= inicio &&
                f < fin
            );

        }
    );

}


// ==========================================================
// CALENDARIO VISUAL
// ==========================================================

function generarCalendario() {

    calendar.innerHTML =
        "";


    const hoy =
        normalizarFecha(
            new Date()
        );


    const primerDia =
        new Date(
            currentYear,
            currentMonth,
            1
        ).getDay();


    const totalDias =
        new Date(
            currentYear,
            currentMonth + 1,
            0
        ).getDate();


    const diasSemana = [

        "Dom",
        "Lun",
        "Mar",
        "Mié",
        "Jue",
        "Vie",
        "Sáb"

    ];


    const nombresMeses = [

        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"

    ];


    // ======================================================
    // MES
    // ======================================================

    document.getElementById(
        "monthLabel"
    ).textContent =
        `${nombresMeses[currentMonth]} ${currentYear}`;


    // ======================================================
    // ENCABEZADOS
    // ======================================================

    diasSemana.forEach(
        dia => {

            const el =
                document.createElement(
                    "div"
                );


            el.textContent =
                dia;


            el.classList.add(
                "day",
                "header"
            );


            calendar.appendChild(
                el
            );

        }
    );


    // ======================================================
    // ESPACIOS VACÍOS
    // ======================================================

    for (
        let i = 0;
        i < primerDia;
        i++
    ) {

        calendar.appendChild(
            document.createElement(
                "div"
            )
        );

    }


    // ======================================================
    // DÍAS
    // ======================================================

    for (
        let dia = 1;
        dia <= totalDias;
        dia++
    ) {

        const fecha =
            normalizarFecha(
                new Date(
                    currentYear,
                    currentMonth,
                    dia
                )
            );


        const el =
            document.createElement(
                "div"
            );


        el.textContent =
            dia;


        el.classList.add(
            "day"
        );


        if (
            fecha < hoy
        ) {

            el.classList.add(
                "past"
            );

        }

        else if (
            fechaBloqueada(
                fecha
            )
        ) {

            el.classList.add(
                "blocked"
            );

        }

        else {

            el.classList.add(
                "available"
            );


            el.addEventListener(
                "click",
                () => {

                    fechaInicio.value =
                        fecha
                            .toISOString()
                            .split("T")[0];


                    fechaFin.min =
                        fechaInicio.value;


                    actualizarResumen();

                    validarDisponibilidad();

                }
            );

        }


        calendar.appendChild(
            el
        );

    }

}


// ==========================================================
// MES ANTERIOR
// ==========================================================

document.getElementById(
    "prevMonth"
).addEventListener(
    "click",
    () => {

        currentMonth--;


        if (
            currentMonth < 0
        ) {

            currentMonth =
                11;

            currentYear--;

        }


        generarCalendario();

    }
);


// ==========================================================
// MES SIGUIENTE
// ==========================================================

document.getElementById(
    "nextMonth"
).addEventListener(
    "click",
    () => {

        currentMonth++;


        if (
            currentMonth > 11
        ) {

            currentMonth =
                0;

            currentYear++;

        }


        generarCalendario();

    }
);


// ==========================================================
// EVENTOS DEL FORMULARIO
// ==========================================================

nombre.addEventListener(
    "input",
    actualizarResumen
);


email.addEventListener(
    "input",
    actualizarResumen
);


personas.addEventListener(
    "change",
    actualizarResumen
);


// ==========================================================
// INICIALIZACIÓN
// ==========================================================

establecerMinFecha();

cargarHabitacionesReserva();

generarCalendario();

actualizarResumen();


// ==========================================================
// OCULTAR HERRAMIENTAS EN GITHUB PAGES
// ==========================================================

if (
    window.location.hostname ===
    "alexato-coder.github.io"
) {

    const btn =
        document.getElementById(
            "btnReiniciar"
        );


    if (btn) {

        btn.style.display =
            "none";

    }

}