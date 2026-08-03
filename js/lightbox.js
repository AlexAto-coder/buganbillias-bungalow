// ==========================
// LIGHTBOX BUGANVILLIAS
// ==========================

const galleryImages = document.querySelectorAll(".img-galeria");
const lightbox = document.querySelector(".imagen-light");
const track = document.querySelector(".lightbox-track");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const closeBtn = document.querySelector(".close-lightbox");

let index = 0;
let startX = 0;

// Verificar que exista el lightbox
if (lightbox && track && galleryImages.length > 0) {

    // Limpiar por si ya existen imágenes
    track.innerHTML = "";

    // Crear el carrusel
    galleryImages.forEach((img, i) => {

        const clone = document.createElement("img");

        clone.src = img.src;
        clone.alt = img.alt;

        track.appendChild(clone);

        // Abrir lightbox al hacer clic
        img.addEventListener("click", () => {

            index = i;

            updateCarousel();

            openLightbox();

        });

    });

}

// ==========================
// Actualizar carrusel
// ==========================

function updateCarousel() {

    track.style.transform = `translateX(-${index * 100}%)`;

}

// ==========================
// Abrir
// ==========================

function openLightbox() {

    lightbox.classList.add("active");

    document.body.classList.add("no-scroll");

}

// ==========================
// Cerrar
// ==========================

function closeLightbox() {

    lightbox.classList.remove("active");

    document.body.classList.remove("no-scroll");

}

// ==========================
// Siguiente
// ==========================

function nextImage() {

    index++;

    if (index >= galleryImages.length) {

        index = 0;

    }

    updateCarousel();

}

// ==========================
// Anterior
// ==========================

function prevImage() {

    index--;

    if (index < 0) {

        index = galleryImages.length - 1;

    }

    updateCarousel();

}

// ==========================
// Flechas
// ==========================

if (nextBtn) {

    nextBtn.addEventListener("click", (e) => {

        e.stopPropagation();

        nextImage();

    });

}

if (prevBtn) {

    prevBtn.addEventListener("click", (e) => {

        e.stopPropagation();

        prevImage();

    });

}

// ==========================
// Botón cerrar (X)
// ==========================

if (closeBtn) {

    closeBtn.addEventListener("click", (e) => {

        e.stopPropagation();

        closeLightbox();

    });

}

// ==========================
// Cerrar haciendo clic fuera
// ==========================

if (lightbox) {

    lightbox.addEventListener("click", (e) => {

        if (e.target === lightbox) {

            closeLightbox();

        }

    });

}

// ==========================
// Swipe móvil
// ==========================

if (track) {

    track.addEventListener("touchstart", (e) => {

        startX = e.touches[0].clientX;

    });

    track.addEventListener("touchend", (e) => {

        const endX = e.changedTouches[0].clientX;

        if (startX - endX > 50) {

            nextImage();

        }

        if (endX - startX > 50) {

            prevImage();

        }

    });

}

// ==========================
// Teclado
// ==========================

document.addEventListener("keydown", (e) => {

    if (!lightbox || !lightbox.classList.contains("active")) return;

    switch (e.key) {

        case "ArrowRight":
            nextImage();
            break;

        case "ArrowLeft":
            prevImage();
            break;

        case "Escape":
            closeLightbox();
            break;

    }

});