// ===============================
// BUGANVILLIAS - PDF
// ===============================

const btnPDF = document.getElementById("btnPDF");

btnPDF.addEventListener("click", generarPDF);

function generarPDF(){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    // Datos

    const codigo = document.getElementById("codigoReserva").textContent;
    const nombre = document.getElementById("rNombre").textContent;
    const correo = document.getElementById("rCorreo").textContent;
    const ingreso = document.getElementById("rIngreso").textContent;
    const salida = document.getElementById("rSalida").textContent;
    const noches = document.getElementById("rNoches").textContent;
    const personas = document.getElementById("rPersonas").textContent;
    const precio = document.getElementById("rPrecio").textContent;
    const total = document.getElementById("rTotal").textContent;

    // Encabezado

    doc.setFont("helvetica","bold");
    doc.setFontSize(20);

   doc.text(
    `${CONFIG.hotel.ciudad} - ${CONFIG.hotel.departamento} - ${CONFIG.hotel.pais}`,
    105,
    28,
    { align: "center" }
);

    doc.setFontSize(11);

    doc.setFont("helvetica","normal");

    doc.text("Los Organos - Piura - Peru",105,28,{align:"center"});

    doc.line(20,35,190,35);

    let y = 50;

    function fila(titulo,valor){

        doc.setFont("helvetica","bold");
        doc.text(titulo,20,y);

        doc.setFont("helvetica","normal");
        doc.text(valor,80,y);

        y += 10;

    }

    fila("Reserva:",codigo);
    fila("Cliente:",nombre);
    fila("Correo:",correo);
    fila("Ingreso:",ingreso);
    fila("Salida:",salida);
    fila("Noches:",noches);
    fila("Personas:",personas);
    fila("Precio por noche:",precio);

    doc.line(20,y+2,190,y+2);

    y += 15;

    doc.setFontSize(16);

    doc.setFont("helvetica","bold");

    doc.text("TOTAL",20,y);

    doc.text(total,170,y,{align:"right"});

    y += 20;

    doc.setFontSize(13);

    doc.text("Estado:",20,y);

    doc.setTextColor(220,120,0);

    doc.text("PENDIENTE DE PAGO",60,y);

    doc.setTextColor(0,0,0);

    y += 25;

    doc.setFontSize(10);

    doc.text(
        "Este documento es una cotizacion de reserva. La reserva sera confirmada una vez recibido el pago.",
        20,
        y,
        {maxWidth:170}
    );

    doc.save(`Reserva-${codigo}.pdf`);

}