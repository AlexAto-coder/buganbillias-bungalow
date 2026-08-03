const form = document.getElementById('reviewForm');
const reviewsList = document.getElementById('reviewsList');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const comment = document.getElementById('comment').value.trim();
  const rating = document.getElementById('rating').value;

  if (!name || !comment || !rating) return;

  const review = document.createElement('div');
  review.classList.add('review');

  review.innerHTML = `
    <h4>${name} <span>${rating}</span></h4>
    <p>${comment}</p>
  `;

  reviewsList.prepend(review);
  form.reset();
});