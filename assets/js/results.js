//---------------------- Search results grid & movie detail modal ----------------------

const searchState = {
    filters: null,
    page: 1,
    totalPages: 0,
    totalResults: 0,
    random: false,
    summary: []
};

/* Escapes user/API supplied text before it goes into innerHTML. */
function esc(text) {
    const div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.innerHTML;
}

function formatCount(n) {
    return Number(n || 0).toLocaleString("en-US");
}

//---------------------- Running a search ----------------------

/*
Runs a fresh discover search and renders the grid.
`summary` is a list of human-readable labels describing the active filters.
Returns the total number of matches (0 on error).
*/
async function runSearch(filters, { random = false, summary = [] } = {}) {
    Object.assign(searchState, { filters, random, summary, page: 1 });

    const section = document.getElementById("resultsSection");
    section.hidden = false;
    renderSummaryPills();
    renderSkeletons();

    try {
        const data = random
            ? await discoverRandomPage(filters)
            : await discoverMovies(filters, 1);
        searchState.page = data.page;
        searchState.totalPages = Math.min(data.total_pages || 0, 500);
        searchState.totalResults = data.total_results || 0;
        renderResults(data.results || [], { replace: true });
        updateResultsCount();
        updateLoadMore();
        return searchState.totalResults;
    } catch (err) {
        console.error(err);
        renderSearchError();
        return 0;
    }
}

/* "Load more" appends the next page; for dice rolls it rerolls a fresh page. */
async function loadMore() {
    const btn = document.getElementById("loadMoreBtn");
    btn.disabled = true;
    try {
        if (searchState.random) {
            const data = await discoverRandomPage(searchState.filters);
            searchState.page = data.page;
            renderResults(data.results || [], { replace: true });
            document.getElementById("resultsGrid").scrollIntoView({ behavior: "smooth" });
        } else {
            const data = await discoverMovies(searchState.filters, searchState.page + 1);
            searchState.page = data.page;
            renderResults(data.results || [], { replace: false });
        }
        updateLoadMore();
    } catch (err) {
        console.error(err);
    } finally {
        btn.disabled = false;
    }
}

function hideResults() {
    document.getElementById("resultsSection").hidden = true;
    document.getElementById("resultsGrid").innerHTML = "";
}

//---------------------- Rendering ----------------------

function renderSummaryPills() {
    const el = document.getElementById("resultsSummary");
    el.innerHTML = searchState.summary
        .map((label) => `<span class="summary-pill">${esc(label)}</span>`)
        .join("");
}

function updateResultsCount() {
    const el = document.getElementById("resultsCount");
    if (searchState.totalResults === 0) {
        el.textContent = "";
    } else {
        el.textContent = `${formatCount(searchState.totalResults)} match${searchState.totalResults === 1 ? "" : "es"}`;
    }
}

function renderSkeletons() {
    const grid = document.getElementById("resultsGrid");
    grid.innerHTML = Array.from({ length: 10 })
        .map(() => `<div class="movie-card skeleton"><div class="poster-wrap"></div></div>`)
        .join("");
    document.getElementById("loadMoreWrap").hidden = true;
}

function movieCardHtml(movie) {
    const year = (movie.release_date || "").slice(0, 4);
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
    const poster = movie.poster_path
        ? `<img class="poster" src="${IMG_BASE}/w342${movie.poster_path}" alt="${esc(movie.title)} poster" loading="lazy">`
        : `<div class="poster poster-fallback"><span>🎬</span>${esc(movie.title)}</div>`;
    return `
        <article class="movie-card" data-id="${movie.id}" tabindex="0" role="button"
                 aria-label="${esc(movie.title)} — details">
            <div class="poster-wrap">
                ${poster}
                ${rating ? `<span class="rating-badge">★ ${rating}</span>` : ""}
                <div class="card-shade"></div>
                <div class="card-meta">
                    <h3>${esc(movie.title)}</h3>
                    ${year ? `<span>${year}</span>` : ""}
                </div>
            </div>
        </article>`;
}

function renderResults(movies, { replace }) {
    const grid = document.getElementById("resultsGrid");
    if (replace && movies.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <span class="empty-emoji">🫥</span>
                <h3>No movies match that combo</h3>
                <p>Try loosening a filter or two — rarities like that hide well.</p>
            </div>`;
        return;
    }
    const html = movies.map(movieCardHtml).join("");
    if (replace) {
        grid.innerHTML = html;
    } else {
        grid.insertAdjacentHTML("beforeend", html);
    }
}

function renderSearchError() {
    document.getElementById("resultsGrid").innerHTML = `
        <div class="empty-state">
            <span class="empty-emoji">📡</span>
            <h3>Lost the connection</h3>
            <p>We couldn't reach the movie database. Check your connection and try again.</p>
        </div>`;
    document.getElementById("loadMoreWrap").hidden = true;
}

function updateLoadMore() {
    const wrap = document.getElementById("loadMoreWrap");
    const btn = document.getElementById("loadMoreBtn");
    const more = searchState.random
        ? searchState.totalPages > 1
        : searchState.page < searchState.totalPages;
    wrap.hidden = !more;
    btn.textContent = searchState.random ? "🎲 Reroll" : "Load more";
}

//---------------------- Movie detail modal ----------------------

function pickTrailer(videos) {
    const list = ((videos && videos.results) || []).filter((v) => v.site === "YouTube");
    return (
        list.find((v) => v.type === "Trailer" && v.official) ||
        list.find((v) => v.type === "Trailer") ||
        list.find((v) => v.type === "Teaser") ||
        list[0] ||
        null
    );
}

function pickCertification(releaseDates, region) {
    const results = (releaseDates && releaseDates.results) || [];
    for (const code of [region, "US"]) {
        if (!code) continue;
        const entry = results.find((r) => r.iso_3166_1 === code);
        const cert = entry && entry.release_dates.find((d) => d.certification);
        if (cert) return cert.certification;
    }
    return null;
}

function providerRowHtml(label, providers) {
    if (!providers || providers.length === 0) return "";
    const logos = providers
        .map(
            (p) => `
            <span class="provider" title="${esc(p.provider_name)}">
                <img src="${IMG_BASE}/w92${p.logo_path}" alt="${esc(p.provider_name)}" loading="lazy">
            </span>`
        )
        .join("");
    return `
        <div class="provider-row">
            <span class="provider-label">${label}</span>
            <div class="provider-logos">${logos}</div>
        </div>`;
}

function whereToWatchHtml(details) {
    const region = appState.region;
    if (!region) {
        return `
            <section class="modal-section">
                <h4>Where to watch</h4>
                <p class="modal-hint">Pick your country in the chat (or Advanced search) to see streaming availability.</p>
            </section>`;
    }
    const data = (details["watch/providers"] && details["watch/providers"].results) || {};
    const regional = data[region];
    const rows = regional
        ? providerRowHtml("Stream", regional.flatrate) +
          providerRowHtml("Rent", regional.rent) +
          providerRowHtml("Buy", regional.buy)
        : "";
    return `
        <section class="modal-section">
            <h4>Where to watch <span class="region-tag">${esc(COUNTRY_NAMES[region] || region)}</span></h4>
            ${rows || `<p class="modal-hint">Not currently streamable in your country. 😢</p>`}
            ${regional && regional.link ? `<a class="justwatch-link" href="${esc(regional.link)}" target="_blank" rel="noreferrer">Full availability on JustWatch →</a>` : ""}
            <p class="attribution-note">Streaming data provided by JustWatch.</p>
        </section>`;
}

function castStripHtml(credits) {
    const cast = ((credits && credits.cast) || []).slice(0, 8);
    if (cast.length === 0) return "";
    const cards = cast
        .map((person) => {
            const photo = person.profile_path
                ? `<img src="${IMG_BASE}/w185${person.profile_path}" alt="${esc(person.name)}" loading="lazy">`
                : `<span class="cast-fallback">${esc(person.name.charAt(0))}</span>`;
            return `
                <figure class="cast-card">
                    <div class="cast-photo">${photo}</div>
                    <figcaption>
                        <strong>${esc(person.name)}</strong>
                        <span>${esc(person.character || "")}</span>
                    </figcaption>
                </figure>`;
        })
        .join("");
    return `
        <section class="modal-section">
            <h4>Cast</h4>
            <div class="cast-strip">${cards}</div>
        </section>`;
}

async function openMovieModal(id) {
    const modal = document.getElementById("movieModal");
    const content = document.getElementById("modalContent");
    modal.classList.add("open");
    document.body.classList.add("modal-open");
    content.innerHTML = `<div class="modal-loading"><span class="spinner"></span></div>`;

    let details;
    try {
        details = await getMovieDetails(id);
    } catch (err) {
        console.error(err);
        content.innerHTML = `
            <button class="modal-close" onclick="closeMovieModal()" aria-label="Close">✕</button>
            <div class="modal-loading"><p>Couldn't load this movie. Please try again.</p></div>`;
        return;
    }

    const year = (details.release_date || "").slice(0, 4);
    const trailer = pickTrailer(details.videos);
    const cert = pickCertification(details.release_dates, appState.region);
    const director = ((details.credits && details.credits.crew) || []).find((c) => c.job === "Director");
    const backdrop = details.backdrop_path ? `${IMG_BASE}/w1280${details.backdrop_path}` : null;
    const poster = details.poster_path ? `${IMG_BASE}/w342${details.poster_path}` : null;

    const metaParts = [
        year,
        details.runtime ? `${details.runtime} min` : null,
        cert ? `<span class="cert-badge">${esc(cert)}</span>` : null,
        details.vote_average
            ? `<span class="modal-rating">★ ${details.vote_average.toFixed(1)}</span> <span class="vote-count">(${formatCount(details.vote_count)} votes)</span>`
            : null
    ].filter(Boolean);

    content.innerHTML = `
        <button class="modal-close" onclick="closeMovieModal()" aria-label="Close">✕</button>
        <div class="modal-hero" id="modalHero">
            ${backdrop ? `<img src="${backdrop}" alt="" aria-hidden="true">` : ""}
            ${trailer ? `
                <button class="play-trailer" data-key="${esc(trailer.key)}">
                    <span class="play-icon">▶</span> Play trailer
                </button>` : ""}
        </div>
        <div class="modal-body">
            <div class="modal-head">
                ${poster ? `<img class="modal-poster" src="${poster}" alt="${esc(details.title)} poster">` : ""}
                <div class="modal-title-block">
                    <h2>${esc(details.title)}</h2>
                    ${details.tagline ? `<p class="tagline">${esc(details.tagline)}</p>` : ""}
                    <p class="modal-meta">${metaParts.join('<span class="dot">·</span>')}</p>
                    <div class="genre-tags">
                        ${(details.genres || []).map((g) => `<span class="genre-tag">${esc(g.name)}</span>`).join("")}
                    </div>
                    ${director ? `<p class="director">Directed by <strong>${esc(director.name)}</strong></p>` : ""}
                </div>
            </div>
            ${details.overview ? `
                <section class="modal-section">
                    <h4>Overview</h4>
                    <p class="overview">${esc(details.overview)}</p>
                </section>` : ""}
            ${castStripHtml(details.credits)}
            ${whereToWatchHtml(details)}
        </div>`;

    const playBtn = content.querySelector(".play-trailer");
    if (playBtn) {
        playBtn.addEventListener("click", () => {
            document.getElementById("modalHero").innerHTML = `
                <iframe src="https://www.youtube.com/embed/${playBtn.dataset.key}?autoplay=1&modestbranding=1&rel=0"
                        title="Trailer" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
        });
    }
}

function closeMovieModal() {
    document.getElementById("movieModal").classList.remove("open");
    document.body.classList.remove("modal-open");
    document.getElementById("modalContent").innerHTML = "";
}

//---------------------- Wiring ----------------------

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("resultsGrid");
    grid.addEventListener("click", (e) => {
        const card = e.target.closest(".movie-card[data-id]");
        if (card) openMovieModal(card.dataset.id);
    });
    grid.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        const card = e.target.closest(".movie-card[data-id]");
        if (card) {
            e.preventDefault();
            openMovieModal(card.dataset.id);
        }
    });

    document.getElementById("loadMoreBtn").addEventListener("click", loadMore);

    const modal = document.getElementById("movieModal");
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeMovieModal();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) closeMovieModal();
    });
});
