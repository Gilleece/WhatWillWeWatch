//---------------------- Stored information & app config ----------------------

/*
TMDB API Key (Hiding the key for this API is not really possible, or necessary, due to the free/unlimited
nature of it. More info here from the API creator:
https://www.themoviedb.org/talk/582744abc3a3683601019dcc?language=en-IE)
*/
const TMDB_API_KEY = "b11a13a3abf2339dc3e37bef3ec05d32";
const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

/*
Shared app state. The region powers the "where to stream" info in movie details
and is remembered between visits.
*/
const appState = {
    region: localStorage.getItem("rememberedCountry") || null
};

/* Movie genres (TMDB ids) */
const GENRES = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" }
];

const GENRE_NAMES = Object.fromEntries(GENRES.map((g) => [g.id, g.name]));

/* Countries with TMDB watch-provider data */
const COUNTRIES = [
    ["AR", "Argentina"], ["AU", "Australia"], ["AT", "Austria"], ["BE", "Belgium"],
    ["BR", "Brazil"], ["CA", "Canada"], ["CL", "Chile"], ["CO", "Colombia"],
    ["CZ", "Czechia"], ["DK", "Denmark"], ["EC", "Ecuador"], ["EE", "Estonia"],
    ["FI", "Finland"], ["FR", "France"], ["DE", "Germany"], ["GR", "Greece"],
    ["HU", "Hungary"], ["IN", "India"], ["ID", "Indonesia"], ["IE", "Ireland"],
    ["IT", "Italy"], ["JP", "Japan"], ["LV", "Latvia"], ["LT", "Lithuania"],
    ["MY", "Malaysia"], ["MX", "Mexico"], ["NL", "Netherlands"], ["NZ", "New Zealand"],
    ["NO", "Norway"], ["PE", "Peru"], ["PH", "Philippines"], ["PL", "Poland"],
    ["PT", "Portugal"], ["RO", "Romania"], ["RU", "Russia"], ["SG", "Singapore"],
    ["ZA", "South Africa"], ["KR", "South Korea"], ["ES", "Spain"], ["SE", "Sweden"],
    ["CH", "Switzerland"], ["TH", "Thailand"], ["TR", "Turkey"], ["GB", "United Kingdom"],
    ["US", "United States"], ["VE", "Venezuela"]
];

const COUNTRY_NAMES = Object.fromEntries(COUNTRIES);

/* Original-language options for the advanced search */
const LANGUAGES = [
    ["", "Any language"],
    ["en", "English"], ["fr", "French"], ["es", "Spanish"], ["de", "German"],
    ["it", "Italian"], ["ja", "Japanese"], ["ko", "Korean"], ["zh", "Chinese"],
    ["hi", "Hindi"], ["pt", "Portuguese"], ["ru", "Russian"], ["sv", "Swedish"],
    ["da", "Danish"], ["no", "Norwegian"], ["fi", "Finnish"], ["nl", "Dutch"],
    ["pl", "Polish"], ["tr", "Turkish"], ["th", "Thai"], ["ar", "Arabic"]
];

//---------------------- Chat flow choices ----------------------

/* "What's the mood?" — each maps to one or more genres (pipe = OR) */
const MOODS = [
    { emoji: "😂", label: "Make me laugh", genres: "35" },
    { emoji: "💥", label: "Adrenaline rush", genres: "28|12" },
    { emoji: "😱", label: "Scare me", genres: "27" },
    { emoji: "🫣", label: "Something thrilling", genres: "53" },
    { emoji: "🤯", label: "Blow my mind", genres: "878|9648" },
    { emoji: "❤️", label: "Something heartfelt", genres: "10749|18" },
    { emoji: "🍿", label: "Family night", genres: "10751|16" },
    { emoji: "🕶️", label: "Gritty & serious", genres: "80|18" },
    { emoji: "🌍", label: "True stories", genres: "99|36" },
    { emoji: "🎲", label: "Surprise me", genres: null }
];

/* "Which era?" — from/to are years (null = open ended) */
const ERAS = [
    { emoji: "✨", label: "Brand new", from: new Date().getFullYear() - 2, to: null },
    { emoji: "📱", label: "2010s & newer", from: 2010, to: null },
    { emoji: "💾", label: "90s / 00s throwback", from: 1990, to: 2009 },
    { emoji: "🎞️", label: "Classics (pre-1990)", from: null, to: 1989 },
    { emoji: "🌀", label: "Any era", from: null, to: null }
];

/* "How much time?" — maximum runtime in minutes (null = no limit) */
const TIMES = [
    { emoji: "⚡", label: "Short & sweet", maxRuntime: 100 },
    { emoji: "🕗", label: "Around two hours", maxRuntime: 135 },
    { emoji: "🏔️", label: "Epics welcome", maxRuntime: null }
];

/* "What kind of pick?" — sorting + vote-count windows */
const VIBES = [
    { emoji: "🔥", label: "Crowd pleaser", sort: "popularity.desc", voteGte: 300 },
    { emoji: "🏆", label: "Critically acclaimed", sort: "vote_average.desc", voteGte: 1000 },
    { emoji: "💎", label: "Hidden gem", sort: "vote_average.desc", voteGte: 50, voteLte: 1500 },
    { emoji: "🎲", label: "Roll the dice", sort: "popularity.desc", voteGte: 100, random: true }
];
