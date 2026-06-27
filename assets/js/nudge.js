//---------------------- Advanced-search attention ----------------------

/*
Gently points people toward the advanced search drawer. Two layers:

1. A periodic "shine" sweep across the header button — frequent at first
   (a couple of times in the opening minute) and tapering off to roughly
   once every three minutes, so it stays noticeable without nagging.
2. A one-off "heads up" tooltip, shown when someone looks like they're
   hunting — a second guided search, repeated "Load more", or a long dwell
   scrolling the results without opening anything.

Both stop for good the moment the drawer is opened: once they've found it,
there's nothing left to advertise. Coordination happens through the
`wwww:*` events the rest of the app dispatches.
*/
(function () {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let drawerUsed = false;   // they've discovered advanced search — go quiet
    let nudged = false;       // tooltip already shown this session
    let searchCount = 0;
    let loadMoreCount = 0;
    let dwellArmed = false;
    let dwellTimer = null;
    let hideTimer = null;
    let shineTimer = null;
    let shineDelay = 6000;   // first sweep ~18s in; grows toward the cap below

    const SHINE_CAP = 30000; // never less often than every 3 minutes
    const DWELL_MS = 10000;   // scrolling results this long without opening one

    const advancedBtn = () => document.getElementById("advancedBtn");
    const nudgeEl = () => document.getElementById("advancedNudge");

    //---------------------- Shine sweep ----------------------

    function scheduleShine() {
        if (reduceMotion || drawerUsed) return;
        shineTimer = setTimeout(function tick() {
            if (drawerUsed) return;
            const btn = advancedBtn();
            const busy =
                document.body.classList.contains("intro-active") ||
                document.body.classList.contains("drawer-open") ||
                document.body.classList.contains("modal-open");
            if (btn && !busy && document.visibilityState === "visible") {
                btn.classList.remove("shine");
                void btn.offsetWidth; // reflow so the animation can restart
                btn.classList.add("shine");
            }
            shineDelay = Math.min(shineDelay * 1.7, SHINE_CAP);
            shineTimer = setTimeout(tick, shineDelay);
        }, shineDelay);
    }

    function stopShine() {
        clearTimeout(shineTimer);
        const btn = advancedBtn();
        if (btn) btn.classList.remove("shine");
    }

    //---------------------- Heads-up tooltip ----------------------

    function showNudge() {
        if (nudged || drawerUsed) return;
        nudged = true;
        stopShine(); // one attention-grabber at a time
        clearTimeout(dwellTimer);
        const el = nudgeEl();
        if (!el) return;
        el.hidden = false;
        requestAnimationFrame(() => el.classList.add("show"));
        hideTimer = setTimeout(hideNudge, 10000);
    }

    function hideNudge() {
        clearTimeout(hideTimer);
        const el = nudgeEl();
        if (!el) return;
        el.classList.remove("show");
        setTimeout(() => { el.hidden = true; }, 300);
    }

    //---------------------- Triggers ----------------------

    document.addEventListener("wwww:search", () => {
        searchCount += 1;
        clearTimeout(dwellTimer);
        dwellArmed = false;
        // A second trip through the guided flow suggests the first didn't land.
        if (searchCount >= 2) showNudge();
    });

    document.addEventListener("wwww:loadmore", () => {
        loadMoreCount += 1;
        if (loadMoreCount >= 2) showNudge();
    });

    // Engaging with a result means they're not lost — call off the dwell timer.
    document.addEventListener("wwww:movieopen", () => clearTimeout(dwellTimer));

    // They found it. Stop everything for the rest of the session.
    document.addEventListener("wwww:draweropen", () => {
        drawerUsed = true;
        stopShine();
        hideNudge();
    });

    // Long scroll through the results without opening anything = still hunting.
    window.addEventListener("scroll", () => {
        if (drawerUsed || nudged || dwellArmed) return;
        const results = document.getElementById("resultsSection");
        if (results && !results.hidden && window.scrollY > 600) {
            dwellArmed = true;
            dwellTimer = setTimeout(showNudge, DWELL_MS);
        }
    }, { passive: true });

    //---------------------- Init ----------------------

    document.addEventListener("DOMContentLoaded", () => {
        const close = document.getElementById("advancedNudgeClose");
        const cta = document.getElementById("advancedNudgeCta");
        if (close) close.addEventListener("click", hideNudge);
        if (cta) {
            cta.addEventListener("click", () => {
                hideNudge();
                if (typeof openDrawer === "function") openDrawer();
            });
        }
        scheduleShine();
    });
})();
