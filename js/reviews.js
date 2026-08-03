// =======================================
// RESEÑAS
// =======================================

const REVIEWS_KEY = "buganvilliasReviews";

const form = document.getElementById("reviewForm");
const reviewsList = document.getElementById("reviewsList");

// Cargar reseñas guardadas
let reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];

// ==============================
// Mostrar reseñas
// ==============================

function mostrarResenas() {

    reviewsList.innerHTML = "";

    reviews
        .slice()
        .reverse()
        .forEach(review => {

            const card = document.createElement("div");

            card.classList.add("review");

            card.innerHTML = `
                <h4>${review.name} <span>${review.rating}</span></h4>
                <p>${review.comment}</p>
                <small>${review.date}</small>
            `;

            reviewsList.appendChild(card);

        });

}

// ==============================
// Guardar reseñas
// ==============================

function guardarResenas() {

    localStorage.setItem(
        REVIEWS_KEY,
        JSON.stringify(reviews)
    );

}

// ==============================
// Nueva reseña
// ==============================

form.addEventListener("submit", function(e){

    e.preventDefault();

    const name = document.getElementById("name").value.trim();

    const comment = document.getElementById("comment").value.trim();

    const rating = document.getElementById("rating").value;

    if(!name || !comment || !rating){

        return;

    }

    reviews.push({

        name,

        comment,

        rating,

        date: new Date().toLocaleDateString("es-PE")

    });

    guardarResenas();

    mostrarResenas();

    form.reset();

});

// Mostrar al abrir la página

mostrarResenas();