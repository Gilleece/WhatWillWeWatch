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

    let baseURL = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApi}&language=en-US&sort_by=${sortBy.value}&vote_count.gte=50&with_runtime.lte=${runtime.value}&include_adult=false&include_video=false&page=1`;
    // Below are options that can't have a default value (hence are not in the base URL)
    let userGenre1 = `&with_genres=${genre.value}`;
    let userGenre2 = `%2C${genre2.value}`;
    let userGenre3 = `%2C${genre3.value}`; 
    let certification =  `&certification_country=US&certification=${ageRating.value}`  

    function preferencesURL (base, gen1, gen2, gen3, cert) {
        let urlCombination = base + gen1;
        //checks for option genre 2 and 3        
        if (gen2 && gen3 != "%2Cnone") {
            urlCombination += gen2 + gen3;
        } else if (gen2 != "%2Cnone" && gen3 === "%2Cnone") {
            urlCombination += gen2;
        } else if (gen3 != "%2Cnone" && gen2 === "%2Cnone") {
            urlCombination += gen3;
        };
        // Checks for age rating selection
        if (`${ageRating.value}` != "all"){
            urlCombination += certification;
        }
        // Returns complete URL
        return urlCombination;
    };

    $.when(
        $.getJSON(preferencesURL(baseURL, userGenre1, userGenre2, userGenre3, certification))
    ).then(
        function(response) {
            let recommendations = response;
            $("#recommendationBox").html(recommendationList(recommendations));
            console.log(response);
        }, function(errorResponse) {
            if (errorResponse.status === 404) {
                $("#recommendationBox").html(`<h2>Oh no, it seems like we can't connect... Please try again!</h2>`);
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
        +`<h4>Average score:</h4><h3>${result.results[i].vote_average}</h3><h4>Score count: ${result.results[i].vote_count}</h4>`
        //Scoring
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