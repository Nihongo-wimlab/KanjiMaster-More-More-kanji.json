// ======================================================
// 1. Centrale kanji.json laden
// ======================================================
async function loadSharedKanji() {
    try {
        const response = await fetch('kanji.json');
        if (!response.ok) {
            console.error("Kan kanji.json niet laden:", response.status);
            return [];
        }
        const sharedKanji = await response.json();
        return sharedKanji;
    } catch (error) {
        console.error("Fout bij laden van kanji.json:", error);
        return [];
    }
}

// ======================================================
// 2. Lokale kanji laden en opslaan
// ======================================================
function loadLocalKanji() {
    const stored = localStorage.getItem('kanjiList');
    return stored ? JSON.parse(stored) : [];
}

function saveLocalKanji(list) {
    localStorage.setItem('kanjiList', JSON.stringify(list));
}

// ======================================================
// 3. Kanji toevoegen (lokaal)
// ======================================================
function addKanji() {
    const kanjiInput = document.getElementById("kanjiInput");
    const meaningInput = document.getElementById("meaningInput");

    const kanji = kanjiInput.value.trim();
    const meaning = meaningInput.value.trim();

    if (kanji === "" || meaning === "") {
        alert("Vul zowel kanji als betekenis in.");
        return;
    }

    const localList = loadLocalKanji();
    localList.push({ kanji, meaning });
    saveLocalKanji(localList);

    kanjiInput.value = "";
    meaningInput.value = "";

    initKanji(); // lijst opnieuw laden
}

// ======================================================
// 4. Kanji verwijderen (alleen lokaal)
// ======================================================
function deleteKanji(index) {
    const localList = loadLocalKanji();
    localList.splice(index, 1);
    saveLocalKanji(localList);
    initKanji();
}

// ======================================================
// 5. Lijst renderen
// ======================================================
function renderKanjiList(list) {
    const container = document.getElementById("kanjiList");
    container.innerHTML = "";

    list.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "kanji-item";

        div.innerHTML = `
            <span class="kanji">${item.kanji}</span>
            <span class="meaning">${item.meaning}</span>
        `;

        // Verwijderknop alleen voor lokale items
        const localList = loadLocalKanji();
        const isLocal = localList.some(
            (localItem) => localItem.kanji === item.kanji && localItem.meaning === item.meaning
        );

        if (isLocal) {
            const btn = document.createElement("button");
            btn.textContent = "Verwijder";
            btn.onclick = () => deleteKanji(index);
            div.appendChild(btn);
        }

        container.appendChild(div);
    });
}

// ======================================================
// 6. Alles combineren en tonen
// ======================================================
async function initKanji() {
    const shared = await loadSharedKanji();
    const local = loadLocalKanji();

    const combined = [...shared, ...local];
    renderKanjiList(combined);
}

// Start de app
initKanji();

// ======================================================
// 7. Exportfunctie voor lokale kanji
// ======================================================
function exportLocalKanji() {
    const local = loadLocalKanji();
    const json = JSON.stringify(local, null, 2);

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "local-kanji-export.json";
    a.click();

    URL.revokeObjectURL(url);
}

// ======================================================
// 8. Event listener voor de exportknop
// ======================================================
document.getElementById("exportButton").addEventListener("click", exportLocalKanji);

// ======================================================
// 9. Event listener voor de toevoegknop
// ======================================================
document.getElementById("addButton").addEventListener("click", addKanji);
