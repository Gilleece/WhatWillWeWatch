/*
API Calls
*/

// This is the function attached to the send button on the form.
function sendPreferences() {
    // Gets some of the user's choices for the initial API call.
    let baseUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApi}&language=en-US&sort_by=${sortBy.value}&vote_count.gte=50&with_runtime.lte=${runtime.value}&vote_average.gte=${minScore.value}&primary_release_date.lte=${decadeTo.value}&primary_release_date.gte=${decadeFrom.value}&with_runtime.gte=60&include_adult=false&include_video=false&page=1`;
    let userGenre1 = `&with_genres=${genre1.value}`;
    let userGenre2 = `%2C${genre2.value}`;
    let userGenre3 = `%2C${genre3.value}`;
    let certification = `&certification_country=US&certification=${ageRating.value}`;    
    //Makes sure recommendationRow is clear to stop previous searches holding over, or having unpopulated cards.
    $(`#recommendationRow`).html("");
    // API get request.
    $.when(
        $.getJSON(preferencesURL(baseUrl, userGenre1, userGenre2, userGenre3, certification))
    ).then(
        function (response) {
            //Checks to make sure "decade from" value is lower than the "to" value, alerts if not.
            if (decadeFrom.value >= decadeTo.value) {
                alert("When choosing to search by decade, 'from' must be lower than 'to'");
            };
            // Handle Success.             
            let recommendations = response;
            $("#recommendationBox").html(recommendationList(recommendations));
        },
        // Handle error
        function (errorResponse) {
            if (errorResponse.status === 404) {
                $("#recommendationRow").html(`<h2>Oh no, it seems like we can't connect... Please try again!</h2>`);
            } else {
                console.log(errorResponse);
                $("#recommendationRow").html(`<h2>Error: ${errorResponse.responseJSON.status_message}</h2>`);
            }
        }
    )
    scrollToRecommendationBox();
};

// This API call returns a youtube link for the "Play trailer" button, it also handles some of the functionality of each play trailer button itself
function getMovieTrailerKey(result, i) {
    let trailerCall = `https://api.themoviedb.org/3/movie/${result.results[i].id}/videos?api_key=${tmdbApi}&language=en-US`;
    $.when(
        $.getJSON(trailerCall)
    ).then(
        function (trailerKey) {
            //If no trailer is available then "Play Trailer" button is removed.            
            if (trailerKey.results.length === 0) {
                $("#trailerButton" + i).remove();
                return;
            }
            //Inserts the trailer youtube URL into the "data-src" of the "Play Trailer" button.
            else {
                $("#trailerButton" + i).attr("data-src", `https://www.youtube.com/embed/${trailerKey.results[0].key}`)
            }
        }
    )
    // Youtube trailer button (credit to Jacob Lett: https://codepen.io/JacobLett/pen/xqpEYE).
    $(this).ready(function () {
        var $videoSrc;
        $('.video-btn').click(function () {
            $videoSrc = $(this).data("src");
        });
        $('#myModal').on('shown.bs.modal', function () {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })
        $('#myModal').on('hide.bs.modal', function () {
            $("#video").attr('src', $videoSrc);
        })
    });
    // End of youtube trailer button code.
};



// This API call takes the user's location input and returns a list of services that the movie can be streamed from.
function getWhereToStream(result, i) {
    let streamCall = `https://api.themoviedb.org/3/movie/${result.results[i].id}/watch/providers?api_key=${tmdbApi}`
    $.when(
        $.getJSON(streamCall)
    ).then(
        function (callResult) {
            let streamList = "";
            let userCountry = `${country.value}`;
            // Checks if the data returned has the user's country as an option, if not then the text "none" is displayed.         
            if (!callResult.results[userCountry]) {
                $("#whereStream" + i).html("<br>None");
            } else {
                // Checks if the data returned for the user's country has "flatrate", if not then the text "none" is displayed.   
                if (!callResult.results[userCountry].hasOwnProperty("flatrate")) {
                    $("#whereStream" + i).html("<br>None");
                } else {
                    //Makes a list of where the movie can be streamed in the selected country.          
                    for (j = 0; j < callResult.results[userCountry].flatrate.length; j++) {
                        if (j === callResult.results[userCountry].flatrate.length-1) {
                        streamList += `<br>${callResult.results[userCountry].flatrate[j].provider_name} `;
                        } else {
                            streamList += `<br>${callResult.results[userCountry].flatrate[j].provider_name}, `;    
                        }
                    } $("#whereStream" + i).html(streamList);
                }
            }
        }
    )
};

// This API call takes the user's location input and returns a list of services that the movie can be rented from.
function getWhereToRent(result, i) {
    let rentCall = `https://api.themoviedb.org/3/movie/${result.results[i].id}/watch/providers?api_key=${tmdbApi}`
    $.when(
        $.getJSON(rentCall)
    ).then(
        function (callResult) {
            let rentList = "";
            let userCountry = `${country.value}`;
            // Checks if the data returned has the user's country as an option, if not then the text "none" is displayed 
            if (!callResult.results[userCountry]) {
                $("#whereRent" + i).html("<br>None");
            } else {
                // Checks if the data returned for the user's country has "rent", if not then the text "none" is displayed
                if (!callResult.results[userCountry].hasOwnProperty("rent")) {
                    $("#whereRent" + i).html("<br>None");
                } else {
                    //Makes a list of where the movie can be rented in the selected country           
                    for (j = 0; j < callResult.results[userCountry].rent.length; j++) {
                        if (j === callResult.results[userCountry].rent.length-1) {
                        rentList += `<br>${callResult.results[userCountry].rent[j].provider_name} `;
                        } else { rentList += `<br>${callResult.results[userCountry].rent[j].provider_name}, `;
                        }
                    } $("#whereRent" + i).html(rentList);
                }
            }
        }
    )
};

// Uses the Movie ID to call the API for additional details that aren't returned in the intial call.
function getMoreMovieDetails(id, i) {
    let idUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApi}&language=en-US`
    $.when(
        $.getJSON(idUrl)
    ).then(
        function (detailsResponse, ) {
            $("#languageText" + i).html(langCodes[detailsResponse.original_language]);
            $("#runtimeText" + i).html(detailsResponse.runtime);
            $("#releaseText" + i).html(detailsResponse.release_date);
            if (detailsResponse.budget == 0) {
                $("#budgetText" + i).html(`Unavailable`);
            } else {
                $("#budgetText" + i).html(`${detailsResponse.budget.toLocaleString()} USD`);
            }
        }
    )
};

let scrollToRecommendationBox = function(){
    document.getElementById("recommendationBox").scrollIntoView();
};
