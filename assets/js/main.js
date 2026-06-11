//---------------------- Boot & intro animation ----------------------

/*
The landing animation: four W's morph into "What Will We Watch?".
The reveal itself is pure CSS (see .intro-rest); this just times the exit,
lets a click/tap skip it, and starts the chat once it's gone.
*/
function runIntro() {
    const intro = document.getElementById("intro");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let finished = false;

    const finish = () => {
        if (finished) return;
        finished = true;
        intro.classList.add("intro-out");
        setTimeout(() => {
            intro.remove();
            document.body.classList.remove("intro-active");
            startChat();
        }, reduceMotion ? 0 : 650);
    };

    if (reduceMotion) {
        finish();
        return;
    }

    document.body.classList.add("intro-active");
    intro.addEventListener("click", finish);
    setTimeout(finish, 3400);
}

document.addEventListener("DOMContentLoaded", () => {
    // Brand acts as a "back to top" affordance.
    document.getElementById("brand").addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    runIntro();
});
