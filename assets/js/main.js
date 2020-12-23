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
    let baseURL = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApi}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`;
    let genre1URL = `&with_genres=${genre.value}`;
    let userGenre2 = `%2C${genre2.value}`;
    let userGenre3 = `%2C${genre3.value}`;
    function preferencesURL (base, gen1, gen2, gen3) {
        //checks for option genre 2 and 3
        if (gen2 && gen3 != "%2Cnone") {
            return base + gen1 + gen2 + gen3;
        } else if (gen2 != "%2Cnone" && gen3 === "%2Cnone") {
            return base + gen1 + gen2;
        } else if (gen3 != "%2Cnone" && gen2 === "%2Cnone") {
            return base + gen1 + gen3;
        } 
        // URL returned if only 1 genre is selected
        return base + gen1;
    };
    $.when(
        $.getJSON(preferencesURL(baseURL, genre1URL, userGenre2, userGenre3))
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
        list += 
        //title 
        `<h2>${result.results[i].title}</h2><br>`
        //summary
        +`<h4>Summary:</h4><p>${result.results[i].overview}</p><br><h4>Genres:</h4><p>` 
        //genre list
        for (j=0; j<result.results[i].genre_ids.length; j++) {
            if (j != result.results[i].genre_ids.length-1) {
                list += `${genreList[result.results[i].genre_ids[j]]},`
                } else { list += `${genreList[result.results[i].genre_ids[j]]} </p><br>` }
            }
    };
    return list;
};