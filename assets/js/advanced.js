//---------------------- Advanced search drawer ----------------------

const advancedState = {
    people: [],          // [{id, name}]
    providersRegion: null // region the provider chips were loaded for
};

function openDrawer() {
    document.dispatchEvent(new Event("wwww:draweropen"));
    // Pick up a country chosen in the chat since the drawer was built.
    const regionSelect = document.getElementById("regionSelect");
    if (appState.region && regionSelect.value !== appState.region) {
        regionSelect.value = appState.region;
        loadProviderChips(appState.region);
    }
    document.getElementById("advancedDrawer").classList.add("open");
    document.getElementById("drawerOverlay").classList.add("open");
    document.body.classList.add("drawer-open");
}

function closeDrawer() {
    document.getElementById("advancedDrawer").classList.remove("open");
    document.getElementById("drawerOverlay").classList.remove("open");
    document.body.classList.remove("drawer-open");
}

//---------------------- Control builders ----------------------

/*
Genre chips are tri-state: tap once to include, twice to exclude, thrice to clear.
Far more compact (and more powerful) than the old three dropdowns.
*/
function buildGenreChips() {
    const wrap = document.getElementById("genreChips");
    wrap.innerHTML = GENRES.map(
        (g) => `<button type="button" class="chip genre-chip" data-id="${g.id}">${g.name}</button>`
    ).join("");
    wrap.addEventListener("click", (e) => {
        const chip = e.target.closest(".genre-chip");
        if (!chip) return;
        if (chip.classList.contains("include")) {
            chip.classList.replace("include", "exclude");
        } else if (chip.classList.contains("exclude")) {
            chip.classList.remove("exclude");
        } else {
            chip.classList.add("include");
        }
    });
}

/* Single-select chip groups (votes, runtime, certification, match mode). */
function buildChipGroup(id, options) {
    const wrap = document.getElementById(id);
    wrap.innerHTML = options
        .map(
            (o, i) =>
                `<button type="button" class="chip group-chip${i === 0 ? " on" : ""}" data-value="${o.value}">${o.label}</button>`
        )
        .join("");
    wrap.addEventListener("click", (e) => {
        const chip = e.target.closest(".group-chip");
        if (!chip) return;
        wrap.querySelectorAll(".group-chip").forEach((c) => c.classList.remove("on"));
        chip.classList.add("on");
    });
}

function chipGroupValue(id) {
    const on = document.querySelector(`#${id} .group-chip.on`);
    return on ? on.dataset.value : "";
}

function setChipGroup(id, value) {
    document.querySelectorAll(`#${id} .group-chip`).forEach((c) => {
        c.classList.toggle("on", c.dataset.value === String(value));
    });
}

/* Dual-handle year range slider. */
let syncYearRange = null;

function initYearRange() {
    const maxYear = new Date().getFullYear() + 1;
    const from = document.getElementById("yearFrom");
    const to = document.getElementById("yearTo");
    [from, to].forEach((input) => {
        input.min = 1900;
        input.max = maxYear;
    });

    syncYearRange = (moved) => {
        let lo = Number(from.value);
        let hi = Number(to.value);
        if (lo > hi) {
            if (moved === from) to.value = lo;
            else from.value = hi;
            lo = Number(from.value);
            hi = Number(to.value);
        }
        document.getElementById("yearFromLabel").textContent = lo <= 1900 ? "Any" : lo;
        document.getElementById("yearToLabel").textContent = hi >= maxYear ? "Any" : hi;
        const pct = (v) => ((v - 1900) / (maxYear - 1900)) * 100;
        const fill = document.getElementById("yearFill");
        fill.style.left = `${pct(lo)}%`;
        fill.style.width = `${pct(hi) - pct(lo)}%`;
    };
    from.addEventListener("input", () => syncYearRange(from));
    to.addEventListener("input", () => syncYearRange(to));
    resetYearRange();
}

function resetYearRange() {
    const from = document.getElementById("yearFrom");
    const to = document.getElementById("yearTo");
    from.value = from.min;
    to.value = to.max;
    syncYearRange();
}

function initRatingSlider() {
    const slider = document.getElementById("minRating");
    const label = document.getElementById("minRatingLabel");
    const update = () => {
        const v = Number(slider.value);
        label.textContent = v === 0 ? "Any" : `${v.toFixed(1)}+`;
        slider.style.setProperty("--fill", `${(v / 9) * 100}%`);
    };
    slider.addEventListener("input", update);
    update();
}

//---------------------- Streaming providers ----------------------

function populateRegionSelect() {
    const select = document.getElementById("regionSelect");
    select.innerHTML =
        `<option value="">No country (skip streaming filter)</option>` +
        COUNTRIES.map(([code, name]) => `<option value="${code}">${name}</option>`).join("");
    if (appState.region) select.value = appState.region;

    select.addEventListener("change", () => {
        if (select.value) {
            appState.region = select.value;
            localStorage.setItem("rememberedCountry", select.value);
        }
        loadProviderChips(select.value);
    });
    loadProviderChips(select.value);
}

/* Loads the most relevant streaming services for the chosen region as toggle chips. */
async function loadProviderChips(region) {
    const wrap = document.getElementById("providerChips");
    const hint = document.getElementById("providerHint");
    if (!region) {
        wrap.innerHTML = "";
        hint.textContent = "Pick a country to filter by streaming service.";
        return;
    }
    if (advancedState.providersRegion === region && wrap.children.length) return;

    wrap.innerHTML = `<span class="provider-loading">Loading services…</span>`;
    try {
        const data = await getRegionProviders(region);
        const providers = (data.results || [])
            .sort((a, b) => (a.display_priorities?.[region] ?? a.display_priority) - (b.display_priorities?.[region] ?? b.display_priority))
            .slice(0, 16);
        advancedState.providersRegion = region;
        wrap.innerHTML = providers
            .map(
                (p) => `
                <button type="button" class="provider-chip" data-id="${p.provider_id}" title="${esc(p.provider_name)}">
                    <img src="${IMG_BASE}/w92${p.logo_path}" alt="${esc(p.provider_name)}" loading="lazy">
                </button>`
            )
            .join("");
        hint.textContent = "Tap services to only show movies available on them.";
    } catch (err) {
        console.error(err);
        wrap.innerHTML = "";
        hint.textContent = "Couldn't load streaming services for that country.";
    }
}

//---------------------- People search ----------------------

function initPeopleSearch() {
    const input = document.getElementById("personInput");
    const results = document.getElementById("personResults");
    let timer = null;

    input.addEventListener("input", () => {
        clearTimeout(timer);
        const q = input.value.trim();
        if (q.length < 2) {
            results.innerHTML = "";
            return;
        }
        timer = setTimeout(async () => {
            try {
                const data = await searchPeople(q);
                const people = (data.results || []).slice(0, 6);
                results.innerHTML = people
                    .map((p) => {
                        const photo = p.profile_path
                            ? `<img src="${IMG_BASE}/w185${p.profile_path}" alt="">`
                            : `<span class="person-fallback">${esc(p.name.charAt(0))}</span>`;
                        return `
                            <button type="button" class="person-result" data-id="${p.id}" data-name="${esc(p.name)}">
                                ${photo}
                                <span class="person-name">${esc(p.name)}</span>
                                <span class="person-dept">${esc(p.known_for_department || "")}</span>
                            </button>`;
                    })
                    .join("");
            } catch (err) {
                console.error(err);
            }
        }, 350);
    });

    results.addEventListener("click", (e) => {
        const item = e.target.closest(".person-result");
        if (!item) return;
        const id = Number(item.dataset.id);
        if (!advancedState.people.some((p) => p.id === id)) {
            advancedState.people.push({ id, name: item.dataset.name });
            renderPersonChips();
        }
        input.value = "";
        results.innerHTML = "";
    });
}

function renderPersonChips() {
    const wrap = document.getElementById("personChips");
    wrap.innerHTML = advancedState.people
        .map(
            (p) => `
            <span class="chip person-chip">${esc(p.name)}
                <button type="button" class="chip-remove" data-id="${p.id}" aria-label="Remove ${esc(p.name)}">✕</button>
            </span>`
        )
        .join("");
}

//---------------------- Apply / reset ----------------------

function collectAdvancedFilters() {
    const filters = { "with_runtime.gte": 60 };
    const summary = [];

    // Genres (include / exclude, match any or all)
    const includes = [...document.querySelectorAll(".genre-chip.include")].map((c) => c.dataset.id);
    const excludes = [...document.querySelectorAll(".genre-chip.exclude")].map((c) => c.dataset.id);
    const matchAll = chipGroupValue("matchChips") === "all";
    if (includes.length) {
        filters.with_genres = includes.join(matchAll ? "," : "|");
        summary.push(includes.map((id) => GENRE_NAMES[id]).join(matchAll ? " + " : " / "));
    }
    if (excludes.length) {
        filters.without_genres = excludes.join(",");
        summary.push(`No ${excludes.map((id) => GENRE_NAMES[id]).join(", ")}`);
    }

    // Year range
    const maxYear = new Date().getFullYear() + 1;
    const yFrom = Number(document.getElementById("yearFrom").value);
    const yTo = Number(document.getElementById("yearTo").value);
    if (yFrom > 1900) filters["primary_release_date.gte"] = `${yFrom}-01-01`;
    if (yTo < maxYear) filters["primary_release_date.lte"] = `${yTo}-12-31`;
    if (yFrom > 1900 || yTo < maxYear) summary.push(`${yFrom > 1900 ? yFrom : "…"}–${yTo < maxYear ? yTo : "…"}`);

    // Minimum rating
    const minRating = Number(document.getElementById("minRating").value);
    if (minRating > 0) {
        filters["vote_average.gte"] = minRating;
        summary.push(`★ ${minRating.toFixed(1)}+`);
    }

    // Minimum votes
    const votes = Number(chipGroupValue("voteChips"));
    if (votes > 0) {
        filters["vote_count.gte"] = votes;
        summary.push(`${votes}+ votes`);
    }

    // Runtime
    const runtime = chipGroupValue("runtimeChips");
    if (runtime) {
        const [lo, hi] = runtime.split("-").map(Number);
        if (lo > 60) filters["with_runtime.gte"] = lo;
        if (hi < 900) filters["with_runtime.lte"] = hi;
        const label = document.querySelector("#runtimeChips .group-chip.on").textContent;
        summary.push(label);
    }

    // Certification (US system, as before)
    const cert = chipGroupValue("certChips");
    if (cert) {
        filters.certification_country = "US";
        filters.certification = cert;
        summary.push(`Rated ${cert}`);
    }

    // Original language
    const lang = document.getElementById("langSelect").value;
    if (lang) {
        filters.with_original_language = lang;
        summary.push(document.getElementById("langSelect").selectedOptions[0].textContent);
    }

    // Streaming providers
    const region = document.getElementById("regionSelect").value;
    const providerIds = [...document.querySelectorAll(".provider-chip.on")].map((c) => c.dataset.id);
    if (region && providerIds.length) {
        filters.watch_region = region;
        filters.with_watch_providers = providerIds.join("|");
        summary.push(`On ${providerIds.length} service${providerIds.length === 1 ? "" : "s"}`);
    }

    // People
    if (advancedState.people.length) {
        filters.with_people = advancedState.people.map((p) => p.id).join(",");
        summary.push(`With ${advancedState.people.map((p) => p.name).join(", ")}`);
    }

    // Sorting — guard score sorts with a sensible vote floor so obscure
    // 10/10-from-three-votes entries don't drown out real movies.
    const sort = document.getElementById("sortSelect").value;
    filters.sort_by = sort;
    if (sort.startsWith("vote_average") && !filters["vote_count.gte"]) {
        filters["vote_count.gte"] = 200;
    }

    if (region) summary.push(COUNTRY_NAMES[region]);

    return { filters, summary };
}

function resetAdvanced() {
    document.querySelectorAll(".genre-chip").forEach((c) => c.classList.remove("include", "exclude"));
    setChipGroup("matchChips", "any");
    setChipGroup("voteChips", "0");
    setChipGroup("runtimeChips", "");
    setChipGroup("certChips", "");
    document.getElementById("minRating").value = 0;
    document.getElementById("minRating").dispatchEvent(new Event("input"));
    resetYearRange();
    document.getElementById("langSelect").value = "";
    document.getElementById("sortSelect").value = "popularity.desc";
    document.querySelectorAll(".provider-chip.on").forEach((c) => c.classList.remove("on"));
    advancedState.people = [];
    renderPersonChips();
    document.getElementById("personInput").value = "";
    document.getElementById("personResults").innerHTML = "";
}

//---------------------- Init ----------------------

function initAdvanced() {
    buildGenreChips();
    buildChipGroup("matchChips", [
        { value: "any", label: "Match any" },
        { value: "all", label: "Match all" }
    ]);
    buildChipGroup("voteChips", [
        { value: "0", label: "Any" },
        { value: "50", label: "50+" },
        { value: "250", label: "250+" },
        { value: "1000", label: "1000+" }
    ]);
    buildChipGroup("runtimeChips", [
        { value: "", label: "Any" },
        { value: "0-90", label: "< 90 min" },
        { value: "90-120", label: "90–120" },
        { value: "120-150", label: "120–150" },
        { value: "150-900", label: "150+" }
    ]);
    buildChipGroup("certChips", [
        { value: "", label: "Any" },
        { value: "G", label: "G" },
        { value: "PG", label: "PG" },
        { value: "PG-13", label: "PG-13" },
        { value: "R", label: "R" },
        { value: "NC-17", label: "NC-17" }
    ]);
    initYearRange();
    initRatingSlider();

    const langSelect = document.getElementById("langSelect");
    langSelect.innerHTML = LANGUAGES.map(([code, name]) => `<option value="${code}">${name}</option>`).join("");

    populateRegionSelect();
    initPeopleSearch();

    document.getElementById("providerChips").addEventListener("click", (e) => {
        const chip = e.target.closest(".provider-chip");
        if (chip) chip.classList.toggle("on");
    });
    document.getElementById("personChips").addEventListener("click", (e) => {
        const remove = e.target.closest(".chip-remove");
        if (!remove) return;
        advancedState.people = advancedState.people.filter((p) => p.id !== Number(remove.dataset.id));
        renderPersonChips();
    });

    document.getElementById("advancedBtn").addEventListener("click", openDrawer);
    document.getElementById("closeDrawerBtn").addEventListener("click", closeDrawer);
    document.getElementById("drawerOverlay").addEventListener("click", closeDrawer);
    document.getElementById("resetAdvancedBtn").addEventListener("click", resetAdvanced);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeDrawer();
    });

    document.getElementById("applyAdvancedBtn").addEventListener("click", async () => {
        const { filters, summary } = collectAdvancedFilters();
        closeDrawer();
        await runSearch(filters, { summary });
        document.getElementById("resultsSection").scrollIntoView({ behavior: "smooth" });
    });
}

document.addEventListener("DOMContentLoaded", initAdvanced);
