// Api Keys (Hiding the key for this API is not really possible, or necessary due to the free/unlimited nature of it. More info here: https://www.themoviedb.org/talk/582744abc3a3683601019dcc?language=en-IE)

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

// Send Request Function

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

// Other Functions

function getMovieIdList(list) {
    movieIds = [];
    for (i = 0; i < list.results.length; i++){
        movieIds.push(list.results[i].id);
    }
    return movieIds;    
};

function getMoreMovieDetails(id, numerator){
    let idUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApi}&language=en-US`        
    $.when(
        $.getJSON(idUrl)
    ).then(               
        function(detailsResponse) {
            //use jquery to populate divs by numeration in here

        
        }
    )
    
};

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
    //placeholder as string, later push to divs using jQuery. ie: for loop... divID+numerator = result    
    //let list = "";    
    if (result.total_results == 0) {
        return `<h2>Sorry, we found no movies that match your search settings. :(</h2>`;
    };
    for (i=0; i<result.results.length; i++){ 
        console.log(result);       
        $("#movieTitle" + i).html(`${result.results[i].title}`);
        $("#poster" + i).attr("src",`https://image.tmdb.org/t/p/w300/${result.results[i].poster_path}`);
        getMovieTrailerKey(i, result);
        
        //Scoring
        //+`<h4>Summary:</h4><p>${result.results[i].overview}</p><br><h4>Genres:</h4><p>`
        
        //summary
        //+`<h4>Average score:</h4><h3>${result.results[i].vote_average}</h3><h4>Score count: ${result.results[i].vote_count}</h4>`
        
        //genre list
        //for (j=0; j<result.results[i].genre_ids.length; j++) {
        //    if (j != result.results[i].genre_ids.length-1) {
        //        list += `${genreList[result.results[i].genre_ids[j]]},`
        //        } else { list += `${genreList[result.results[i].genre_ids[j]]} </p><br>` }
        //    }
        //Get more details by using the Movie ID        
        getMoreMovieDetails(idList[i], i);        

    };
    return list;
};

function getMovieTrailerKey(i, result) {    
    let trailerCall = `https://api.themoviedb.org/3/movie/${result.results[i].id}/videos?api_key=${tmdbApi}&language=en-US`;        
    $.when(
        $.getJSON(trailerCall)
    ).then(               
        function(trailerKey) {
            console.log("Test tickles");
            $("#trailerButton" + i).attr("data-src", `https://www.youtube.com/embed/${trailerKey.results[0].key}`)       
        }
    )
    
};


// Youtube trailer button (credit to Jacob Lett: https://codepen.io/JacobLett/pen/xqpEYE)
$(document).ready(function() {
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



