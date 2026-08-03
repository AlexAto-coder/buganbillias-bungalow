// ===============================
// ELEMENTOS DEL DOM
// ===============================
const formReserva = document.getElementById("formReserva");
const fechaInicio = document.getElementById("fechaInicio");
const fechaFin = document.getElementById("fechaFin");
const mensajeReserva = document.getElementById("mensajeReserva");
const calendar = document.getElementById("calendar");
const btnConfirmar = document.getElementById("btnConfirmar");
const nombre = document.getElementById("nombre");
const email = document.getElementById("email");
const telefono = document.getElementById("telefono");
const personas = document.getElementById("personas");
const observaciones = document.getElementById("observaciones");
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

function generarCodigo(){

    const ahora = new Date();

    return "BB-" +
        ahora.getFullYear() +
        String(ahora.getMonth()+1).padStart(2,"0") +
        String(ahora.getDate()).padStart(2,"0") +
        "-" +
        Math.floor(Math.random()*900+100);

}

// ===========================
// TARIFA
// ===========================

const PRECIO_POR_NOCHE = CONFIG.reservas.precioNoche;

// Resumen

const rNombre = document.getElementById("rNombre");
const rCorreo = document.getElementById("rCorreo");
const codigoReserva = document.getElementById("codigoReserva");
const rIngreso = document.getElementById("rIngreso");
const rSalida = document.getElementById("rSalida");
const rPersonas = document.getElementById("rPersonas");
const rNoches = document.getElementById("rNoches");
const rPrecio = document.getElementById("rPrecio");
const rTotal = document.getElementById("rTotal");

// ===========================
// ACTUALIZAR RESUMEN
// ===========================

function actualizarResumen(){

    const nombre = document.getElementById("nombre").value;
    const ingreso = document.getElementById("fechaInicio").value;
    const salida = document.getElementById("fechaFin").value;
    const personas = document.getElementById("personas").value;
    const correo = document.getElementById("email").value;
    codigoReserva.textContent = generarCodigo();
    rCorreo.textContent = correo || "-";
    rNombre.textContent = nombre || "-";
    rIngreso.textContent = ingreso || "-";
    rSalida.textContent = salida || "-";
    rPersonas.textContent = personas || "-";

    if(ingreso && salida){

    const fecha1 = new Date(ingreso + "T00:00:00");
    const fecha2 = new Date(salida + "T00:00:00");
    const milisegundosPorDia = 1000 * 60 * 60 * 24;
    const noches = Math.round((fecha2 - fecha1) / milisegundosPorDia);

        if(noches > 0){

            rNoches.textContent = noches;

            const total = noches * PRECIO_POR_NOCHE;

            rPrecio.textContent = `S/${PRECIO_POR_NOCHE.toFixed(2)}`;

            rTotal.textContent = `S/${total.toFixed(2)}`;

        }else{

            rNoches.textContent = 0;

            rTotal.textContent = "S/0.00";

        }

    }

}

// ===============================
// DATOS DE RESERVAS (ejemplo)
// ===============================
const RESERVAS_KEY = "reservasBuganvillias";

const reservasIniciales = [
  { inicio: "2026-02-10", fin: "2026-02-14" },
  { inicio: "2026-02-20", fin: "2026-02-22" }
];

let reservasExistentes =
  JSON.parse(localStorage.getItem(RESERVAS_KEY)) || reservasIniciales;

if (!localStorage.getItem(RESERVAS_KEY)) {
    guardarReservas();
}
// ===============================
// UTILIDADES
// ===============================
function normalizarFecha(fecha) {

    if (typeof fecha === "string") {

        const [anio, mes, dia] = fecha.split("-").map(Number);

        return new Date(anio, mes - 1, dia);

    }

    return new Date(
        fecha.getFullYear(),
        fecha.getMonth(),
        fecha.getDate()
    );

}
function guardarReservas() {
  localStorage.setItem(
    RESERVAS_KEY,
    JSON.stringify(reservasExistentes)
  );
}

// ===============================
// BLOQUEAR FECHAS PASADAS (HTML)
// ===============================
function establecerMinFecha() {
  const hoy = normalizarFecha(new Date());
  const hoyISO = hoy.toISOString().split("T")[0];
  fechaInicio.min = hoyISO;
  fechaFin.min = hoyISO;
}
establecerMinFecha();

// ===============================
// VALIDAR FECHA RESERVADA
// ===============================
  function fechaEstaReservada(fecha) {
  const f = normalizarFecha(fecha);

  return reservasExistentes.some(reserva => {
    const inicio = normalizarFecha(reserva.inicio);
    const fin = normalizarFecha(reserva.fin);
    return f >= inicio && f < fin; // checkout libre
  });
}

// ===============================
// DISPONIBILIDAD DE RANGO
// ===============================
function rangoDisponible(inicio, fin) {
  const i = normalizarFecha(inicio);
  const f = normalizarFecha(fin);

  return !reservasExistentes.some(reserva => {
    const rInicio = normalizarFecha(reserva.inicio);
    const rFin = normalizarFecha(reserva.fin);
    return i < rFin && f > rInicio;
  });
}

// ===============================
// VALIDAR DISPONIBILIDAD (HABILITA BOTÓN)
// ===============================
function validarDisponibilidad() {
  btnConfirmar.disabled = true;
  mensajeReserva.textContent = "";

  if (!fechaInicio.value || !fechaFin.value) return;

  const hoy = normalizarFecha(new Date());
  const inicio = normalizarFecha(fechaInicio.value);
  const fin = normalizarFecha(fechaFin.value);

  if (inicio < hoy) {
    mensajeReserva.textContent = "❌ No puedes reservar fechas pasadas.";
    mensajeReserva.style.color = "red";
    return;
  }

  if (fin <= inicio) {
    mensajeReserva.textContent =
      "⚠️ La fecha de salida debe ser posterior a la fecha de ingreso.";
    mensajeReserva.style.color = "orange";
    return;
  }

  if (!rangoDisponible(inicio, fin)) {
    mensajeReserva.textContent =
      "❌ No hay disponibilidad para ese rango de fechas.";
    mensajeReserva.style.color = "red";
    return;
  }

  const noches = (fin - inicio) / (1000 * 60 * 60 * 24);

  mensajeReserva.innerHTML = `
    ✅ <strong>Disponibilidad confirmada</strong><br>
    Noches: ${noches}
  `;
  mensajeReserva.style.color = "green";

  btnConfirmar.disabled = false;
}

// ===============================
// EVENTOS DE FECHAS
// ===============================
fechaInicio.addEventListener("change", () => {
  const inicio = normalizarFecha(fechaInicio.value);
  const hoy = normalizarFecha(new Date());

  if (inicio < hoy || fechaEstaReservada(inicio)) {
    alert("❌ Fecha no disponible.");
    fechaInicio.value = "";
    btnConfirmar.disabled = true;
    return;
  }

  fechaFin.min = fechaInicio.value;
  validarDisponibilidad();
});

fechaFin.addEventListener("change", () => {
  const fin = normalizarFecha(fechaFin.value);

  if (fechaEstaReservada(fin)) {
    alert("❌ Fecha no disponible.");
    fechaFin.value = "";
    btnConfirmar.disabled = true;
    return;
  }

  validarDisponibilidad();
});

// ===============================
// CONFIRMAR RESERVA
// ===============================
formReserva.addEventListener("submit", function (e) {
  e.preventDefault();

  if (btnConfirmar.disabled) return;

  reservasExistentes.push({
    id: Date.now(),
    nombre: nombre.value,
    email: email.value,
    telefono: telefono.value,
    personas: personas.value,
    inicio: fechaInicio.value,
    fin: fechaFin.value,
    fechaRegistro: new Date().toLocaleString("es-PE")
});

guardarReservas();

  mensajeReserva.textContent = "🎉 Reserva confirmada correctamente.";
  mensajeReserva.style.color = "green";

  generarCalendario();
  formReserva.reset();
  btnConfirmar.disabled = true;
});

function fechaBloqueada(fecha) {

    const f = normalizarFecha(fecha);

    return reservasExistentes.some(reserva => {

        const inicio = normalizarFecha(reserva.inicio);
        const fin = normalizarFecha(reserva.fin);

        // El día de salida queda libre
        return f >= inicio && f < fin;

    });

}

// ===============================
// CALENDARIO VISUAL
// ===============================
function generarCalendario() {
  calendar.innerHTML = "";

  const hoy = normalizarFecha(new Date());

  const primerDia = new Date(currentYear, currentMonth, 1).getDay();
  const totalDias = new Date(currentYear, currentMonth + 1, 0).getDate();

  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // 🏷️ Mes actual
  document.getElementById("monthLabel").textContent =
    `${nombresMeses[currentMonth]} ${currentYear}`;

  // Encabezados
  diasSemana.forEach(dia => {
    const el = document.createElement("div");
    el.textContent = dia;
    el.classList.add("day", "header");
    calendar.appendChild(el);
  });

  // Espacios vacíos
  for (let i = 0; i < primerDia; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  // Días del mes
  for (let dia = 1; dia <= totalDias; dia++) {
    const fecha = normalizarFecha(
      new Date(currentYear, currentMonth, dia)
    );

    const el = document.createElement("div");
    el.textContent = dia;
    el.classList.add("day");

    if (fecha < hoy) {
      el.classList.add("past");
    } else if (fechaBloqueada(fecha)) {
      el.classList.add("blocked");
    } else {
      el.classList.add("available");
      el.addEventListener("click", () => {
        fechaInicio.value = fecha.toISOString().split("T")[0];
        fechaFin.min = fechaInicio.value;
        validarDisponibilidad();
      });
    }

    calendar.appendChild(el);
  }
}
// ===============================
// AGREGA LOS BOTONES DE NAVEGACIÓN
// ===============================
  document.getElementById("prevMonth").addEventListener("click", () => {
     currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generarCalendario();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  generarCalendario();
});
// ===============================
generarCalendario();

// ===============================
generarCalendario();

// ===============================
// BORRAR TODAS LAS RESERVAS
// ===============================
function borrarReservas() {

    if (confirm("¿Eliminar todas las reservas?")) {

        localStorage.removeItem(RESERVAS_KEY);

        location.reload();

    }

}

nombre.addEventListener("input", actualizarResumen);

fechaInicio.addEventListener("change", actualizarResumen);

fechaFin.addEventListener("change", actualizarResumen);

personas.addEventListener("change", actualizarResumen);