// ==========================================
// MOVIE SEARCH WEBSITE
// External API: OMDb API
// ==========================================


// Put your OMDb API key here
const API_KEY = "a2884644";


// Get HTML elements
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const movieResults = document.getElementById("movieResults");
const resultsTitle = document.getElementById("resultsTitle");
const statusText = document.getElementById("status");

const movieModal = document.getElementById("movieModal");
const movieDetails = document.getElementById("movieDetails");
const closeModal = document.getElementById("closeModal");


// ==========================================
// SEARCH MOVIES
// ==========================================

async function searchMovies() {

    const searchTerm = searchInput.value.trim();

    // Check if user entered something
    if (searchTerm === "") {

        statusText.textContent = "Please enter a movie title.";

        movieResults.innerHTML = "";
        resultsTitle.textContent = "";

        return;
    }


    // Show loading message
    statusText.textContent = "Searching for movies...";
    movieResults.innerHTML = "";
    resultsTitle.textContent = "";


    try {

        // Connect to OMDb API
        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&type=movie`
        );


        // Convert API response into JavaScript object
        const data = await response.json();


        // Check API response
        if (data.Response === "False") {

            statusText.textContent =
                data.Error || "No movies found.";

            return;
        }


        // Display results
        statusText.textContent =
            `Found ${data.Search.length} movie result(s).`;

        resultsTitle.textContent =
            `Search results for "${searchTerm}"`;


        displayMovies(data.Search);


    } catch (error) {

        console.error(error);

        statusText.textContent =
            "Unable to connect to the movie database. Please try again.";

    }
}


// ==========================================
// DISPLAY MOVIES
// ==========================================

function displayMovies(movies) {

    movieResults.innerHTML = "";


    movies.forEach(movie => {

        const movieCard = document.createElement("div");

        movieCard.classList.add("movie-card");


        // Handle movies without posters
        const poster =
            movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/300x450?text=No+Poster";


        movieCard.innerHTML = `

            <img
                src="${poster}"
                alt="${movie.Title} poster"
            >

            <div class="movie-info">

                <h3>${movie.Title}</h3>

                <p>
                    <strong>Year:</strong>
                    ${movie.Year}
                </p>

                <button
                    class="details-button"
                    onclick="showMovieDetails('${movie.imdbID}')"
                >
                    View Details
                </button>

            </div>

        `;


        movieResults.appendChild(movieCard);

    });
}


// ==========================================
// GET MOVIE DETAILS
// ==========================================

async function showMovieDetails(imdbID) {

    try {

        movieDetails.innerHTML =
            "<p>Loading movie information...</p>";

        movieModal.style.display = "block";


        // Request detailed information
        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`
        );


        const movie = await response.json();


        if (movie.Response === "False") {

            movieDetails.innerHTML =
                "<p>Unable to load movie details.</p>";

            return;
        }


        const poster =
            movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/300x450?text=No+Poster";


        // Display movie details
        movieDetails.innerHTML = `

            <div class="details-container">

                <img
                    src="${poster}"
                    alt="${movie.Title} poster"
                >


                <div class="details-text">

                    <h2>${movie.Title}</h2>

                    <p>
                        <strong>Year:</strong>
                        ${movie.Year}
                    </p>

                    <p>
                        <strong>Genre:</strong>
                        ${movie.Genre}
                    </p>

                    <p>
                        <strong>Runtime:</strong>
                        ${movie.Runtime}
                    </p>

                    <p>
                        <strong>Director:</strong>
                        ${movie.Director}
                    </p>

                    <p>
                        <strong>Actors:</strong>
                        ${movie.Actors}
                    </p>

                    <p>
                        <strong>IMDb Rating:</strong>
                        ⭐ ${movie.imdbRating}
                    </p>

                    <p>
                        <strong>Plot:</strong>
                        ${movie.Plot}
                    </p>

                </div>

            </div>

        `;


    } catch (error) {

        console.error(error);

        movieDetails.innerHTML =
            "<p>Unable to load movie information.</p>";

    }
}


// ==========================================
// CLOSE MODAL
// ==========================================

closeModal.addEventListener("click", function () {

    movieModal.style.display = "none";

});


// Close modal when clicking outside it
window.addEventListener("click", function(event) {

    if (event.target === movieModal) {

        movieModal.style.display = "none";

    }

});


// ==========================================
// SEARCH BUTTON
// ==========================================

searchButton.addEventListener("click", searchMovies);


// ==========================================
// PRESS ENTER TO SEARCH
// ==========================================

searchInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {

        searchMovies();

    }

});
