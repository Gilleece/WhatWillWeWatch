/* 
HTML Generation and user input handling. 
*/

// This function contains, and generates, the HTML for each recommendation card.
function generateCardHtml(i) {
    $(`#recommendationRow`).append(` 
            <div id="recommendation${i}" class="card col-lg-3">   
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
                            Runtime: <span id="runtimeText${i}"></span> mins<br> 
                            Release date: <span id="releaseText${i}"></span><br> 
                            Budget: <span id="budgetText${i}"></span>
                        </li>
                    </ul>
                </div>
            </div>`
    );
}

// This function deals with the user's genre choices, and age rating choice.
function preferencesURL(base, gen1, gen2, gen3, cert) {
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
    if (ageRating.value != "all") {
        urlCombination += cert;
    }
    // Returns complete URL
    return urlCombination;
};

// This function handles the bulk of calling other functions to generate the recommendation cards.
function recommendationList(result) {
    // If no results are found, based on the user's choices.
    if (result.total_results == 0) {
        $(`#recommendationRow`).html(`<h2>Sorry, we found no movies that match your search settings. :(</h2>`);
        return;
    };
    // Resets any generated recommendation divs.   
    for (x = 0; x < 21; x++) { $(`#recommendation${x}`).html("") };
    // Most of the HTML in each recommendation card is done here.
    for (i = 0; i < result.results.length; i++) {
        generateCardHtml(i);
        $("#movieTitle" + i).html(result.results[i].title);
        $("#poster" + i).attr("src", `https://image.tmdb.org/t/p/w300/${result.results[i].poster_path}`);
        getMovieTrailerKey(result, i);
        $("#score" + i).html(result.results[i].vote_average);
        $("#scoreCount" + i).html(result.results[i].vote_count);
        $("#genreText" + i).html(getGenreList(result, i));
        $("#summaryText" + i).html(result.results[i].overview);
        getWhereToStream(result, i);
        getWhereToRent(result, i);
        getMoreMovieDetails(result.results[i].id, i);
    };
};

// This generates the list of genres, along with formatting, to be put into the recommendation card
function getGenreList(result, i) {
    let genreListResult = "";
    for (j = 0; j < result.results[i].genre_ids.length; j++) {
        if (j != result.results[i].genre_ids.length - 1) {
            genreListResult += `${genreList[result.results[i].genre_ids[j]]},`
        } else { genreListResult += `${genreList[result.results[i].genre_ids[j]]} </p><br>` }
    } return genreListResult;
};







