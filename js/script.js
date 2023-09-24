const global = {
  currentPage: window.location.pathname,
  spinner: document.querySelector(".spinner"),
};

//Higlight menu when active
function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

//ShowHide spinner
function showSpinner() {
  global.spinner.classList.add("show");
}

//Hide spinner
function hideSpinner() {
  global.spinner.classList.remove("show");
}

//Display popular movies
async function displayPopularMovies() {
  const { results } = await fetchDataMoviesApi("movie/popular");
  const popuparMoviesDiv = document.getElementById("popular-movies");
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
                ${
                  movie.poster_path
                    ? `<img
                src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
                class="card-img-top"
                alt="${movie.title}"
                />`
                    : `<img
                src="../images/no-image.jpg"
                class="card-img-top"
                alt="No image"
                />`
                }
            </a>
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">
                    <small class="text-muted">Release: ${
                      movie.release_date
                    }</small>
                </p>
            </div>
        `;
    popuparMoviesDiv.appendChild(div);
    console.log(movie);
  });
}

//Display TV SHOWS
async function displayPopularTvShows() {
  const { results } = await fetchDataMoviesApi("trending/tv/week");
  const popularSDiv = document.getElementById("popular-shows");
  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
        ${
          show.poster_path
            ? `<img
                    src="https://image.tmdb.org/t/p/w500/${show.poster_path}"
                    class="card-img-top"
                    alt="${show.name}"
                />`
            : `<img
                    src="../images/no-image.jpg"
                    class="card-img-top"
                    alt="No image"
                />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${show.name}</h5>
        <p class="card-text">
            <small class="text-muted">Aired: ${show.first_air_date}</small>
        </p>
      </div>
          `;
    popularSDiv.appendChild(div);
    console.log(show);
  });
}

//Movie details
async function displayMovieDetails() {
  const movieId = window.location.search.split("=")[1];
  const movie = await fetchDataMoviesApi(`movie/${movieId}`);
  displayBackgroundImage("movie", movie.backdrop_path);
  const div = document.createElement("div");
  div.innerHTML = `
  <div class="details-top">
  <div>
  ${
    movie.poster_path
      ? `<img
              src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
          />`
      : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="No image"
          />`
  }
  </div>
  <div>
    <h2>${movie.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>
      ${movie.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
    ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <a href="${
      movie.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
      movie.budget
    )}</li>
    <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
      movie.revenue
    )}</li>
    <li><span class="text-secondary">Runtime:</span> ${
      movie.runtime
    } minutes</li>
    <li><span class="text-secondary">Status:</span> ${movie.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
    ${movie.production_companies
      .map((companie) => `<span>${companie.name}</span>`)
      .join(", ")}
  </div>
</div>
  `;

  document.getElementById("movie-details").appendChild(div);
}

//TV Shows details
async function displayShowDetails() {
  const showId = window.location.search.split("=")[1];
  const show = await fetchDataMoviesApi(`tv/${showId}`);
  displayBackgroundImage("tvShow", show.backdrop_path);
  const div = document.createElement("div");
  div.innerHTML = `
    <div class="details-top">
          <div>
          ${
            show.poster_path
              ? `<img
                      src="https://image.tmdb.org/t/p/w500/${show.poster_path}"
                      class="card-img-top"
                      alt="${show.name}"
                  />`
              : `<img
                      src="../images/no-image.jpg"
                      class="card-img-top"
                      alt="No image"
                  />`
          }
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
            <p>
            ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
            </ul>
            <a href="${
              show.homepage
            }" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${
              show.number_of_episodes
            }</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${
                show.last_episode_to_air.name
              }
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${show.production_companies
            .map((companie) => companie.name)
            .join(", ")}
          </div>
        </div>
    `;

  document.getElementById("show-details").appendChild(div);
}

function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";

  if (type === "movie") {
    document.getElementById("movie-details").appendChild(overlayDiv);
  } else {
    document.getElementById("show-details").appendChild(overlayDiv);
  }
}

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Fetch Data from the API
async function fetchDataMoviesApi(endpoint) {
  showSpinner();
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNjE2MmUwYTk5Yzc1NWIxNDE5OGFlNTcyOGZiZjQwYyIsInN1YiI6IjY0ZmM4Njk5ZGMxY2I0MDEzZDBmMTNkNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VG3sPHpfCjdCE1F945kSDNW-BoglUg50wTepAqQnxn4",
    },
  };

  const API_KEY = "d6162e0a99c755b14198ae5728fbf40c";
  const API_URL = "https://api.themoviedb.org/3/";

  const response = await fetch(`${API_URL}${endpoint}?language=en-US`, options);
  const data = await response.json();
  hideSpinner();
  return data;
}

// Init App
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      console.log("Home");
      displayPopularMovies();
      break;
    case "/shows.html":
      console.log("Shows");
      displayPopularTvShows();
      break;
    case "/movie-details.html":
      console.log("Movie details");
      displayMovieDetails();
      break;
    case "/tv-details.html":
      console.log("TV details");
      displayShowDetails();
      break;
    case "/search.html":
      console.log("Search");
      break;
  }

  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
