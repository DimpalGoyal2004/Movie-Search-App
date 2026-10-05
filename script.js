const API_KEY = "ce8f20cc";

const movieInput = document.querySelector("#movieInput");
const type = document.querySelector("#type");
const year = document.querySelector("#year");
const searchBtn = document.querySelector("#searchBtn");
const movieContainer = document.querySelector("#movieContainer");
const message = document.querySelector("#message");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const pageNumber = document.querySelector("#pageNumber");

let currentPage = 1;
let totalPages = 1;


// Search movies
async function searchMovies() {

    const movie = movieInput.value.trim();
    const selectedType = type.value;
    const selectedYear = year.value.trim();

    // Empty search
    if (movie === "") {
        message.textContent = "Please enter a movie name.";
        movieContainer.innerHTML = "";
        return;
    }

    // Loading
    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";
    message.textContent = "Searching movies...";
    movieContainer.innerHTML = "";

    try {

        let url =
            `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(movie)}&page=${currentPage}`;

        // Type filter
        if (selectedType !== "all") {
            url += `&type=${selectedType}`;
        }

        // Year filter
        if (selectedYear !== "") {
            url += `&y=${selectedYear}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        // API error
        if (data.Response === "False") {
            message.textContent = data.Error || "No movies found.";
            movieContainer.innerHTML = "";
            updatePagination();
            return;
        }

        // Total results
        const totalResults = Number(data.totalResults);

        totalPages = Math.ceil(totalResults / 10);

        message.textContent =
            `${totalResults} results found`;

        // Display movies
        data.Search.forEach((movie) => {

            let poster = movie.Poster;

            // Poster fallback
            if (poster === "N/A") {
                poster =
                    "https://via.placeholder.com/300x450?text=No+Poster";
            }

            movieContainer.innerHTML += `
                <div class="movie-card">

                    <img
                        src="${poster}"
                        alt="${movie.Title}"
                    >

                    <div class="movie-info">

                        <h2>${movie.Title}</h2>

                        <p>
                            ${movie.Year} • ${movie.Type}
                        </p>

                    </div>

                </div>
            `;
        });

        updatePagination();

    } catch (error) {

        message.textContent =
            "Something went wrong. Please try again.";

        movieContainer.innerHTML = "";

        console.log(error);

    } finally {

        searchBtn.disabled = false;
        searchBtn.textContent = "Search";

    }
}


// Pagination
function updatePagination() {

    pageNumber.textContent =
        `Page ${currentPage} of ${totalPages}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= totalPages;
}


// Search button
searchBtn.addEventListener("click", () => {

    currentPage = 1;

    searchMovies();

});


// Enter key search
movieInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        currentPage = 1;

        searchMovies();

    }

});


// Previous page
prevBtn.addEventListener("click", () => {

    if (currentPage > 1) {

        currentPage--;

        searchMovies();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

});


// Next page
nextBtn.addEventListener("click", () => {

    if (currentPage < totalPages) {

        currentPage++;

        searchMovies();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

});