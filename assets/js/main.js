// Api Keys

const tmdbApi = "b11a13a3abf2339dc3e37bef3ec05d32";

// Genre

let genreList = {
    28 : "Action",
    12 : "Adventure",
    16 : "Animation",
    35 : "Comedy",
    80 : "Crime",
    99 : "Documentary",
    18 : "Drama",
    10751 : "Family",
    14 : "Fantasy",
    36 : "History",
    27 : "Horror",
    10402 : "Music",
    9648 : "Mystery",
    10749 : "Romance",
    878 : "Science Fiction",
    10770 : "TV Movie",
    53 : "Thriller",
    10752 : "War",
    37 : "Western"
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
    };

// Other Functions

function recommendationList(result) {
    //placeholder as string, later push to divs using jQuery. ie: for loop... divID+numerator = result
    
    let list = "";
    for (i=0; i<result.results.length; i++){
        list +=  `<h2>${result.results[i].title}</h2><br><h4>Summary:</h4><p>${result.results[i].overview}</p><br><h4>Genres:</h4><p>${genreList[result.results[i].genre_ids[i]]}</p><br>`    
    };
    return list;
};