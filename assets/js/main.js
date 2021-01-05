// Api Keys (Hiding the key for this API is not really possible, or necessary, due to the free/unlimited nature of it. More info here from the API creator: https://www.themoviedb.org/talk/582744abc3a3683601019dcc?language=en-IE)

const tmdbApi = "b11a13a3abf2339dc3e37bef3ec05d32";

// Genre List

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

// Send Request Function - This is the function attached to the send button on the form

function sendPreferences() { 

    let baseUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApi}&language=en-US&sort_by=${sortBy.value}&vote_count.gte=50&with_runtime.lte=${runtime.value}&vote_average.gte=${minScore.value}&primary_release_date.lte=${decadeTo.value}&primary_release_date.gte=${decadeFrom.value}&with_runtime.gte=60&include_adult=false&include_video=false&page=1`;
    let userGenre1 = `&with_genres=${genre.value}`;
    let userGenre2 = `%2C${genre2.value}`;
    let userGenre3 = `%2C${genre3.value}`; 
    let certification = `&certification_country=US&certification=${ageRating.value}`  

    $.when(
        $.getJSON(preferencesURL(baseUrl, userGenre1, userGenre2, userGenre3, certification))
    ).then(               
        function(response) {
            if(`${decadeFrom.value}` >= `${decadeTo.value}`) {
            alert("When choosing to search by decade, 'from' must be lower than 'to'");
            return console.log("Error: Decade from higher than decade to");
            };             
            let recommendations = response;
            $("#recommendationBox").html(recommendationList(recommendations, getMovieIdList(recommendations)));            
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

// This is the primary function that handles the generation of the recommendation list

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
            urlCombination += cert;
        }
        // Returns complete URL
        return urlCombination;
    };

function recommendationList(result, idList) {        
    if (result.total_results == 0) {
        return `<h2>Sorry, we found no movies that match your search settings. :(</h2>`;
    };    
    for (x=0; x<21; x++){$(`#recommendation${x}`).html("")};
    for (i=0; i<result.results.length; i++){          
    
    generateCardHtml(result, i);
    $("#movieTitle" + i).html(`${result.results[i].title}`);
    $("#poster" + i).attr("src",`https://image.tmdb.org/t/p/w300/${result.results[i].poster_path}`);
    getMovieTrailerKey(result, i);
    $("#score" + i).html(`${result.results[i].vote_average}`);
    $("#scoreCount" + i).html(`${result.results[i].vote_count}`);        
    $("#genreText" + i).html(getGenreList(result, i));
    $("#summaryText" + i).html(`${result.results[i].overview}`);
    getWhereToStream(result, i);
    getWhereToRent(result, i);            
    getMoreMovieDetails(result.results[i].id, i);        

    };    
};

// This function contains, and generates, the HTML for each recommendation card

function generateCardHtml(result, i){
    $(`#recommendation${i}`).html(`    
                <div class="card-header text-center">
                    <h4 id="movieTitle${i}" class="card-title text-center"></h4>
                </div>
                <img id="poster${i}" class="card-img-top" src="" alt="Movie Poster">
                <div class="card-body mx-auto">
                    <button id="trailerButton${i}" type="button" class="btn btn-primary video-btn mx-auto" data-toggle="modal" data-src="" data-target="#myModal">
                        <span id="trailerButtonText${i}">Play Trailer</span>
                    </button>                                        
                </div>
                <div class="card-body pt-0">
                    <h5 class="card-title">SCORE: <span id="score${i}" class="score-text"></span></h5>
                    <h6 class="card-subtitle mb-2 text-muted">Based on <span id="scoreCount${i}"></span> votes</h6>
                    <h6 class="card-subtitle pt-1 pb-1">Genre: <span id="genreText${i}"></span></h6>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><strong>Summary:</strong>"<span id="summaryText${i}"></span>"</li>
                        <li class="list-group-item"><strong>Stream at: </strong><span id="whereStream${i}"></span><br><strong>Rent at: </strong><span id="whereRent${i}"></span></li>
                        <li class="list-group-item">
                            Original Language: <span id="languageText${i}"></span><br>
                            Runtime: <span id="runtimeText${i}"></span>mins<br> 
                            Release date: <span id="releaseText${i}"></span><br> 
                            Budget: <span id="budgetText${i}"></span>USD
                        </li>
                    </ul>
                </div>`
            );
            
        }

// This function returns a youtube link for the "Play trailer" button, it also handles some of the functionality of each play trailer button itself

function getMovieTrailerKey(result, i) {    
    let trailerCall = `https://api.themoviedb.org/3/movie/${result.results[i].id}/videos?api_key=${tmdbApi}&language=en-US`;        
    $.when(
        $.getJSON(trailerCall)
    ).then(               
        function(trailerKey) {            
            $("#trailerButton" + i).attr("data-src", `https://www.youtube.com/embed/${trailerKey.results[0].key}`)       
        }
    )
    // Youtube trailer button (credit to Jacob Lett: https://codepen.io/JacobLett/pen/xqpEYE)
        $(this).ready(function() {
            var $videoSrc;  
            $('.video-btn').click(function() {
                $videoSrc = $(this).data( "src" );
            });  
            $('#myModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src',$videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0" ); 
            })
            $('#myModal').on('hide.bs.modal', function (e) {   
                $("#video").attr('src',$videoSrc); 
            })  
        });
    // End of youtube trailer button code.
    };
    
// This generates the list of genres, along with formatting, to be put into the recommendation card

function getGenreList(result, i) {
    let genreListResult = "";
        for (j=0; j<result.results[i].genre_ids.length; j++) {
            if (j != result.results[i].genre_ids.length-1) {
                genreListResult += `${genreList[result.results[i].genre_ids[j]]},`
                } else { genreListResult += `${genreList[result.results[i].genre_ids[j]]} </p><br>` }
            } return genreListResult;
};

// This takes the user's location input and returns a list of services that the movie can be streamed from

function getWhereToStream(result, i) {
    let streamCall = `https://api.themoviedb.org/3/movie/${result.results[i].id}/watch/providers?api_key=${tmdbApi}`           
    $.when(
        $.getJSON(streamCall)
    ).then(               
        function(callResult) {            
            let streamList = "";
            let userCountry = `${country.value}`;  
            $("#whereStream" + i).html("None");            
            if (!callResult.results[userCountry].flatrate){                
                $("#whereStream" + i).html("None");                                
            } else {           
                for (j=0; j<callResult.results[userCountry].flatrate.length; j++) {
                 streamList += `<br>${callResult.results[userCountry].flatrate[j].provider_name} `;
                } $("#whereStream" + i).html(streamList);
            }
        }
    )
};

// This takes the user's location input and returns a list of services that the movie can be rented from

function getWhereToRent(result, i) {
    let rentCall = `https://api.themoviedb.org/3/movie/${result.results[i].id}/watch/providers?api_key=${tmdbApi}`           
    $.when(
        $.getJSON(rentCall)
    ).then(               
        function(callResult) {            
            let rentList = "";
            let userCountry = `${country.value}`;  
            $("#whereRent" + i).html("None");            
            if (!callResult.results[userCountry].rent){                
                $("#whereRent" + i).html("None");                                
            } else {           
                for (j=0; j<callResult.results[userCountry].rent.length; j++) {
                 rentList += `<br>${callResult.results[userCountry].rent[j].provider_name} `;
                } $("#whereRent" + i).html(rentList);
            }
        }
    )
};

// Creates an array of movieIDs for use in other functions  

function getMovieIdList(list) {
    movieIds = [];
    for (i = 0; i < list.results.length; i++){
        movieIds.push(list.results[i].id);
    }
    return movieIds;    
};

// Uses the Movie ID to call the API for additional details that aren't returned in the intial call

function getMoreMovieDetails(id, i){       
    let idUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApi}&language=en-US`        
    $.when(
        $.getJSON(idUrl)
    ).then(               
        function(detailsResponse,) {            
            $("#languageText" + i).html(detailsResponse.original_language.toUpperCase());        
        }
    )
    
};





