// script.js
const apiKey = '34392c13f400ebfd866c39b3987c5e04';
const baseUrl = 'https://api.themoviedb.org/3';
const moviesContainer = document.getElementById('movies');
const loadMoreButton = document.getElementById('load-more');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const modalPoster = document.getElementById('modal-poster');
const modalOverview = document.getElementById('modal-overview');
const stars = document.querySelectorAll('.stars span');
const userRating = document.getElementById('user-rating');

let currentMovieId = null;
let currentPage = 1;

// Cargar películas populares al iniciar
fetchMovies(currentPage);

// Función para cargar películas
function fetchMovies(page) {
  fetch(`${baseUrl}/movie/popular?api_key=${apiKey}&language=es&page=${page}`)
    .then(response => response.json())
    .then(data => {
      showMovies(data.results);
      if (data.page < data.total_pages) {
        loadMoreButton.style.display = 'block';
      } else {
        loadMoreButton.style.display = 'none';
      }
    })
    .catch(error => console.error('Error fetching movies:', error));
}

// Mostrar películas en la cuadrícula
function showMovies(movies) {
  movies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');
    movieElement.dataset.id = movie.id;
    movieElement.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" loading="lazy">
      <h3>${movie.title}</h3>
    `;
    moviesContainer.appendChild(movieElement);
  });

  // Agregar evento de clic a cada película
  document.querySelectorAll('.movie').forEach(movie => {
    movie.addEventListener('click', () => openModal(movie.dataset.id));
  });
}

// Abrir el modal con los detalles de la película
function openModal(movieId) {
  currentMovieId = movieId;
  fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}&language=es`)
    .then(response => response.json())
    .then(data => {
      modalTitle.textContent = data.title;
      modalPoster.src = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'ruta/a/imagen/por/defecto.jpg';
      modalOverview.textContent = data.overview || 'Descripción no disponible.';
      modal.classList.add('active');
      loadUserRating(movieId);
    })
    .catch(error => console.error('Error fetching movie details:', error));
}

// Cargar la puntuación del usuario desde el almacenamiento local
function loadUserRating(movieId) {
  const rating = localStorage.getItem(`rating_${movieId}`) || 0;
  userRating.textContent = rating;
  updateStars(rating);
}

// Actualizar las estrellas según la puntuación
function updateStars(rating) {
  stars.forEach(star => {
    star.classList.toggle('active', star.dataset.value <= rating);
  });
}

// Manejar la puntuación con las estrellas
stars.forEach(star => {
  star.addEventListener('click', () => {
    const rating = star.dataset.value;
    userRating.textContent = rating;
    updateStars(rating);
    localStorage.setItem(`rating_${currentMovieId}`, rating);
  });
});

// Cerrar el modal
closeModal.addEventListener('click', () => {
  modal.classList.remove('active');
  updateStars(0); // Resetear estrellas
});

// Cerrar el modal al hacer clic fuera del contenido
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.remove('active');
    updateStars(0); // Resetear estrellas
  }
});

// Cargar más películas
loadMoreButton.addEventListener('click', () => {
  currentPage++;
  fetchMovies(currentPage);
});
