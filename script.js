let currentMatchday = 1;
const LEAGUE_SHORT = "bl1";
const SEASON = 2024;

// Umschalten zw Spieltagen und Tabelle 
function switchBundesligaSubView(subViewId, buttonElement) {
    // alle Ansichten ausblenden
    document.querySelectorAll('#view-b1 .sub-view').forEach(view => view.classList.remove('active'));
    // gewählte Ansicht einblenden
    document.getElementById(subViewId).classList.add('active');
    // alle Buttons inaktiuv schalten
    document.querySelectorAll('#view-b1 .segment-btn').forEach(btn => btn.classList.remove('active'));
    // gewählten Buttons aktiv schalten
    buttonElement.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    initMatchdayDropdown();
    loadCurrentMatchday();
});

function initMatchdayDropdown() {
    const select = document.getElementById('b1-day-select');
    select.innerHTML = '';
    for(let i=1; i<=34; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i}. Spieltag`;
        select.appendChild(option);
    }
}

async function loadCurrentMatchday () {
    try {
        const res = await fetch(`https://api.openligadb.de/getcurrentgroup/${LEAGUE_SHORT}`);
        const data = await res.json();
        if (data && data.groupOrderID) {
            currentMatchday = data.groupOrderID;
        }
    } catch (e) {
        console.warn("Konnte aktuellen Spieltag nicht ermitteln, nehme Spieltag 1", e);
        currentMatchday = 1;
    }
    updateMatchdayUI();
    fetchMatches(currentMatchday);
}

async function fetchMatches(day) {
    const container = document.getElementById('b1-matches-list');
    container.innerHTML = '<div class="loading-state">Lade Spieltag...</div>';
    try {
        const res = await fetch(`https://api.openligadb.de/getmatchdata/${LEAGUE_SHORT}/${SEASON}/${day}`);
        const matches = await res.json();
        renderMatches(matches);
    } catch (err) {
        container.innerHTML = '<div class="loading-state">Fehler beim Laden der Spiele.</div>';
        console.error(err);
    }
}

// Spiele als iOS-Karten darstellen
    function renderMatches(matches) {
    const container = document.getElementById('b1-matches-list');
    if (!matches || matches.length === 0) {
        container.innerHTML = '<div class="loading-state">Keine Spiele gefunden.</div>';
        return;
    }
    container.innerHTML = matches.map(match => {
        // Formatierung Datum & Uhrzeit (z. B. Sa, 15:30)
        let timeString = "";
        if (match.matchDateTime) {
            const d = new Date(match.matchDateTime);
            const options = { weekday: 'short', hour: '2-digit', minute: '2-digit' };
            timeString = d.toLocaleDateString('de-DE', options);
        }

        // Endergebnis oder Halbzeitstand ermitteln
        let scoreText = "- : -";
        if (match.matchIsFinished && match.matchResults && match.matchResults.length > 0) {
            // Ergebnis mit Typ 2 ist üblicherweise das Endergebnis
            const finalResult = match.matchResults.find(r => r.resultTypeID === 2) || match.matchResults[0];
            scoreText = `${finalResult.pointsTeam1} : ${finalResult.pointsTeam2}`;
        }

        return `
            <div class="match-card">
            <div class="match-header">${timeString}</div>
            <div class="match-row">
            <div class="match-team">
            <img class="team-logo" src="${match.team1.teamIconUrl}" alt="" onerror="this.style.display='none'">
            <span>${match.team1.shortName || match.team1.teamName}</span>
            </div>
            <div class="match-score">${scoreText}</div>
            <div class="match-team away">
            <span>${match.team2.shortName || match.team2.teamName}</span>
            <img class="team-logo" src="${match.team2.teamIconUrl}" alt="" onerror="this.style.display='none'">
            </div>
            </div>
            </div>
            `;
    }).join('');
}

function changeMatchday(delta) {
    const newDay = currentMatchday + delta;
    if (newDay >= 1 && newDay <= 34) {
        currentMatchday = newDay;
        updateMatchdayUI();
        fetchMatches(currentMatchday);
    }
}

function onMatchdaySelect(dayValue) {
    currentMatchday = parseInt(dayValue, 10);
    updateMatchdayUI();
    fetchMatches(currentMatchday);
}

function updateMatchdayUI() {
    document.getElementById('b1-day-select').value = currentMatchday;
    document.getElementById('b1-prev-day').disabled = (currentMatchday <= 1);
    document.getElementById('b1-next-day').disabled = (currentMatchday >= 34);
}