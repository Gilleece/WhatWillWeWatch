// Api Keys

const tmdbApi = "b11a13a3abf2339dc3e37bef3ec05d32";

// Genre

let genreList = {
    "Action" : 28,
    "Adventure" : 12,
    "Animation" : 16,
    "Comedy" : 35,
    "Crime" : 80,
    "Documentary" : 99,
    "Drama" : 18,
    "Family" : 10751,
    "Fantasy" : 14,
    "History" : 36,
    "Horror" : 27,
    "Music" : 10402,
    "Mystery" : 9648,
    "Romance" : 10749,
    "Science Fiction" : 878,
    "TV Movie" : 10770,
    "Thriller" : 53,
    "War" : 10752,
    "Western" : 37
    }

// Send Request Function

function sendPreferences(preferencesForm) { 
    let preferencesURL = "https://api.themoviedb.org/3/discover/movie?api_key=b11a13a3abf2339dc3e37bef3ec05d32&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=28";
    $.when(
        $.getJSON(preferencesURL)
    ).then(
        function(response) {
            let recommendations = response;
            $("#recommendationBox").html(recommendationList(recommendations));
            console.log(response);
        }, function(errorResponse) {
            if (errorResponse.status === 404) {
                $("#recommendationBox").html(`<h2>Oh no, it seems like we can't find any movies matching those preferences...</h2>`);
            } else {
                console.log(errorResponse);
                $("#recommendationBox").html(`<h2>Error: ${errorResponse.responseJSON.status_message}</h2>`);
            }
        }
    )
    }

