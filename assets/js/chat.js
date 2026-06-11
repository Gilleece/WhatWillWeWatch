//---------------------- Conversational guided search ----------------------

const chatState = {};

function chatEl() {
    return document.getElementById("chat");
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function scrollChatIntoView() {
    const el = chatEl();
    el.lastElementChild && el.lastElementChild.scrollIntoView({ behavior: "smooth", block: "end" });
}

//---------------------- Chat primitives ----------------------

/* Bot message with a typing indicator beforehand, so it feels alive. */
async function botSay(text, delay = 650) {
    const typing = document.createElement("div");
    typing.className = "msg bot typing";
    typing.innerHTML = `<span class="avatar">🎬</span><div class="bubble"><span class="dots"><i></i><i></i><i></i></span></div>`;
    chatEl().appendChild(typing);
    scrollChatIntoView();
    await sleep(delay);
    typing.remove();

    const msg = document.createElement("div");
    msg.className = "msg bot";
    msg.innerHTML = `<span class="avatar">🎬</span><div class="bubble">${text}</div>`;
    chatEl().appendChild(msg);
    scrollChatIntoView();
}

function userSay(text) {
    const msg = document.createElement("div");
    msg.className = "msg user";
    msg.innerHTML = `<div class="bubble">${esc(text)}</div>`;
    chatEl().appendChild(msg);
    scrollChatIntoView();
}

/*
Shows a row of clickable chips and resolves with the chosen option.
Options may carry `value` payloads; the chips are removed once picked
and echoed back as a user bubble. Pass scroll:false when something else
(like the results grid) should keep the viewport instead.
*/
function askChips(options, { scroll = true } = {}) {
    return new Promise((resolve) => {
        const row = document.createElement("div");
        row.className = "chip-row";
        options.forEach((opt) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "chip";
            btn.innerHTML = `${opt.emoji ? `<span class="chip-emoji">${opt.emoji}</span>` : ""}${esc(opt.label)}`;
            btn.addEventListener("click", () => {
                row.remove();
                userSay(`${opt.emoji ? opt.emoji + " " : ""}${opt.label}`);
                resolve(opt);
            });
            row.appendChild(btn);
        });
        chatEl().appendChild(row);
        if (scroll) scrollChatIntoView();
    });
}

/* Inline country picker for the "somewhere else" path — still click-only. */
function askCountrySelect() {
    return new Promise((resolve) => {
        const wrap = document.createElement("div");
        wrap.className = "chip-row country-pick";
        const select = document.createElement("select");
        select.className = "chat-select";
        select.innerHTML =
            `<option value="" disabled selected>Choose a country…</option>` +
            COUNTRIES.map(([code, name]) => `<option value="${code}">${name}</option>`).join("");
        const confirm = document.createElement("button");
        confirm.type = "button";
        confirm.className = "chip chip-primary";
        confirm.textContent = "Confirm";
        confirm.disabled = true;
        select.addEventListener("change", () => (confirm.disabled = !select.value));
        confirm.addEventListener("click", () => {
            const code = select.value;
            wrap.remove();
            userSay(COUNTRY_NAMES[code]);
            resolve(code);
        });
        wrap.append(select, confirm);
        chatEl().appendChild(wrap);
        scrollChatIntoView();
    });
}

//---------------------- The flow itself ----------------------

async function askRegion() {
    // Only a country the user themselves picked before is offered as a
    // shortcut — no locale-based default, to keep the site country-neutral.
    const remembered = appState.region;
    const options = [];
    if (remembered && COUNTRY_NAMES[remembered]) {
        options.push({ label: COUNTRY_NAMES[remembered], value: remembered });
    }
    options.push({ emoji: "🌍", label: remembered ? "Somewhere else…" : "Pick my country…", value: "other" });
    options.push({ emoji: "⏭️", label: "Skip", value: null });

    const pick = await askChips(options);
    if (pick.value === "other") {
        return askCountrySelect();
    }
    return pick.value;
}

function buildChatFilters() {
    const { mood, era, time, vibe } = chatState;
    const filters = {
        sort_by: vibe.sort,
        "vote_count.gte": vibe.voteGte,
        "with_runtime.gte": 60
    };
    if (vibe.voteLte) filters["vote_count.lte"] = vibe.voteLte;
    if (mood.genres) filters.with_genres = mood.genres;
    if (era.from) filters["primary_release_date.gte"] = `${era.from}-01-01`;
    if (era.to) filters["primary_release_date.lte"] = `${era.to}-12-31`;
    if (time.maxRuntime) filters["with_runtime.lte"] = time.maxRuntime;
    return filters;
}

function chatSummary() {
    const { mood, era, time, vibe } = chatState;
    const parts = [
        `${mood.emoji} ${mood.label}`,
        `${era.emoji} ${era.label}`,
        `${time.emoji} ${time.label}`,
        `${vibe.emoji} ${vibe.label}`
    ];
    if (appState.region) {
        parts.push(COUNTRY_NAMES[appState.region]);
    }
    return parts;
}

const ACKS = ["Good call.", "Love it.", "Excellent taste.", "On it.", "Nice."];
function randomAck() {
    return ACKS[Math.floor(Math.random() * ACKS.length)];
}

async function startChat() {
    chatEl().innerHTML = "";
    hideResults();

    await botSay("Hey! I'm your movie matchmaker.", 450);
    await botSay("Answer a few quick questions and I'll line up tonight's watchlist. First up — <strong>what's the mood?</strong>");
    chatState.mood = await askChips(MOODS);

    await botSay(`${randomAck()} <strong>Which era are we feeling?</strong>`);
    chatState.era = await askChips(ERAS);

    await botSay("<strong>How much time have you got?</strong>");
    chatState.time = await askChips(TIMES);

    await botSay(`${randomAck()} Last one — <strong>what kind of pick should it be?</strong>`);
    chatState.vibe = await askChips(VIBES);

    await botSay("Want to see <strong>where you can stream</strong> the matches? Pick your country, or skip.");
    const region = await askRegion();
    if (region) {
        appState.region = region;
        localStorage.setItem("rememberedCountry", region);
    }

    await botSay("Rolling the film… 🎬", 900);

    const filters = buildChatFilters();
    const total = await runSearch(filters, {
        random: Boolean(chatState.vibe.random),
        summary: chatSummary()
    });

    if (total > 0) {
        await botSay(
            `I've picked one out for you 🍿 — scroll down for tonight's recommendation, plus <strong>${formatCount(total)} matches</strong> to browse. Tap any title for trailers, cast and where to stream.`,
            500
        );
        offerNextSteps();
        // The results are the payoff — hand them the viewport, and keep the
        // chat (which keeps appending chips) from stealing the scroll back.
        requestAnimationFrame(() => {
            document.getElementById("resultsSection").scrollIntoView({ behavior: "smooth", block: "start" });
        });
    } else {
        await botSay(
            "Hmm, that exact combo came up empty. 🫥 Want to try a different mix, or fine-tune things yourself?",
            500
        );
        offerNextSteps();
    }
}

/* Post-search actions; the chips re-appear after a detour into advanced search. */
async function offerNextSteps() {
    const next = await askChips(
        [
            { emoji: "↺", label: "Start over" },
            { emoji: "🎛️", label: "Open advanced search" }
        ],
        { scroll: false }
    );
    if (next.label === "Start over") {
        startChat();
    } else {
        openDrawer();
        offerNextSteps();
    }
}
