/* 
HTML Generation and user input handling. 
*/

// This function generates the HTML for the genre selections.

function generateGenreHtml() {
    // Generates 3 selects for user
    for (i = 1; i < 4; i++) {
        $("#genreSelector").append(`
        <select id="genre${i}" name="genre${i}">
            <option id="defaultValue${i}" value="none" selected="selected">-</option>
            <option id="firstOption${i}" value="28">Action</option>
            <option value="12">Adventure</option>
            <option value="16">Animation</option>
            <option value="35">Comedy</option>
            <option value="80">Crime</option>
            <option value="99">Documentary</option>
            <option value="18">Drama</option>
            <option value="10751">Family</option>
            <option value="14">Fantasy</option>
            <option value="36">History</option>
            <option value="27">Horror</option>
            <option value="10402">Music</option>
            <option value="9648">Mystery</option>
            <option value="10749">Romance</option>
            <option value="878">Science Fiction</option>
            <option value="10770">TV Movie</option>
            <option value="53">Thriller</option>
            <option value="10752">War</option>
            <option value="37">Western</option>
        </select>
        `);
    };
    // Removes the "-" option from genre1 as at least 1 genre is needed.
    $("#defaultValue1").remove();
    // Sets the selected option for genre1 as the first option in the list.
    $("#firstOption1").attr("selected", true);

}


// This function contains, and generates, the HTML for each recommendation card.
function generateCardHtml(i) {
    $(`#recommendationRow`).append(` 
                    <div id="recommendation${i}" class="card col-md-3 col-lg-2 h-100 justify-content-center">
            <div class="row align-items-stretch">
                <img id="poster${i}" class="card-img-top" src="" alt="Movie Poster">
                <div class="col-4 score-box">
                    <h5 class="card-title pull-left"><i class="fa fa-star star" aria-hidden="true"></i><span id="score${i}"
                            class="score-text"></span></h5>
                    <h6 class="card-subtitle mb-2 score-count-text pull-left"><span id="scoreCount${i}"></span>
                        votes&nbsp;&nbsp;&nbsp;&nbsp;</h6>
                </div>
            </div>
            <div class="card-body pt-0">
                <div class="card-header text-center">
                    <h4 id="movieTitle${i}" class="card-title title-text text-center"></h4>
                </div>
                <div class="col-12 text-center">
                    <button id="trailerButton${i}" type="button" class="btn btn-secondary video-btn mx-auto" data-toggle="modal"
                        data-src="" data-target="#myModal">
                        <span id="trailerButtonText${i}"><i class="fa fa-play-circle" aria-hidden="true"></i> Trailer</span>
                    </button>
                </div>
            </div>
            <div id="accordion${i}">                
                <div id="collapse${i}" class="collapse" aria-labelledby="moreDetails" data-parent="#accordion${i}">
                    <div class="col-12">
                        <span class="category-summary">Summary: </span>"<span id="summaryText${i}"
                            class="category-text-larger"></span>"
                    </div>
                    <div class="col-12">
                        <br>
                    </div>
                    <div class="col-12">
                        <div class="row">
                            <div class="col-6">
                                <span class="category">Stream at: </span><span id="whereStream${i}"
                                    class="category-text-larger"></span>
                            </div>
                            <div class="col-6">
                                <span class="category">Rent at: </span><span id="whereRent${i}"
                                    class="category-text-larger"></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <br>
                    </div>
                    <div class="col-12">
                        <span class="category-small">Genre: </span><span id="genreText${i}" class="category-Text"></span><br>
                        <span class="category-small">Language: </span><span id="languageText${i}"
                            class="category-Text"></span><br>
                        <span class="category-small">Runtime: </span><span id="runtimeText${i}" class="category-Text"></span>
                        <span class="category-Text">mins</span><br>
                        <span class="category-small">Released: </span><span id="releaseText${i}"
                            class="category-Text"></span><br>
                        <span class="category-small">Budget: </span><span id="budgetText${i}" class="category-Text"></span>
                    </div>
                </div>
            </div>
                <div class="card-header" id="headingOne">
                        <h5 class="mb-0">
                            <button class="btn btn-primary more-details-button" data-toggle="collapse" data-target="#collapse${i}"
                                aria-expanded="true" aria-controls="collapse${i}">
                                Click for details
                            </button>
                        </h5>
                </div>
        </div>
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
        } else { genreListResult += `${genreList[result.results[i].genre_ids[j]]}` }
    } return genreListResult;
};

$('.flexdatalist').flexdatalist({
    selectionRequired: 1,
    minLength: 1
});

/*
Local Storage
*/

// Saves the country selected (saves as in stores data, not heroic feat of bravery) and recalls upon page load.
function saveCountry() {
    $("#country").change(function () {
        localStorage.setItem('rememberedCountry', this.value);
    }); if (localStorage.getItem('rememberedCountry')) {
        $("#country").val(localStorage.getItem('rememberedCountry'));
    }
};








