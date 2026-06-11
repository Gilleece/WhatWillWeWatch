//---------------------- TMDB API calls ----------------------

/* Core fetch wrapper: builds the URL, appends the key, throws on HTTP errors. */
async function tmdb(path, params = {}) {
    const url = new URL(TMDB_BASE + path);
    url.searchParams.set("api_key", TMDB_API_KEY);
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.set(key, value);
        }
    }
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`TMDB request failed (${response.status})`);
    }
    return response.json();
}

/* Main discovery search. `filters` is a plain object of TMDB discover params. */
function discoverMovies(filters, page = 1) {
    return tmdb("/discover/movie", {
        language: "en-US",
        include_adult: "false",
        include_video: "false",
        page,
        ...filters
    });
}

/*
"Roll the dice" search: peeks at the first page to learn how many pages exist,
then jumps to a random one so every roll feels different.
*/
async function discoverRandomPage(filters) {
    const first = await discoverMovies(filters, 1);
    const pages = Math.min(first.total_pages || 1, 25);
    if (pages <= 1) return first;
    const page = 1 + Math.floor(Math.random() * pages);
    return page === 1 ? first : discoverMovies(filters, page);
}

/*
Everything the detail modal needs in a single request:
videos (trailers), credits (cast/director), certifications and watch providers.
*/
function getMovieDetails(id) {
    return tmdb(`/movie/${id}`, {
        language: "en-US",
        append_to_response: "videos,credits,release_dates,watch/providers"
    });
}

/* Streaming services available in a region (for the advanced provider filter). */
function getRegionProviders(region) {
    return tmdb("/watch/providers/movie", { language: "en-US", watch_region: region });
}

/* Person lookup for the "Starring / directed by" advanced filter. */
function searchPeople(query) {
    return tmdb("/search/person", { language: "en-US", include_adult: "false", query });
}
