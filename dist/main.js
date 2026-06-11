/**
 * Vstupni bod aplikace - orchestrace stavu a propojeni s DOMem.
 *
 * Drzi pole zasilek (kolekce), nastavi handlery na formular a tlacitka,
 * a po kazde zmene zavola vykresliManifest(). Ostatni veci (vypocty, render)
 * delegujeme do vlastnich modulu.
 *
 * FAZE 1: hardcoded zasilky, jen vykresleni.
 * FAZE 2: pridani formulare pro vlozeni nove zasilky a mazani polozek.
 * FAZE 3: souhrn, lepsi validace, polish.
 */
import { KATALOG_PREPRAVY, najdiTypPrepravy } from "./data.js";
import { KrehkyBalik } from "./KrehkyBalik.js";
import { NadrozmernyBalik } from "./NadrozmernyBalik.js";
import { vykresliManifest, naplnSelectPrepravy } from "./render.js";
// ---------- inicializace stavu ----------
const STANDARD = najdiTypPrepravy("STD");
const EXPRES = najdiTypPrepravy("EXP");
const CARGO = najdiTypPrepravy("CRG");
if (!STANDARD || !EXPRES || !CARGO) {
    throw new Error("Datový číselník neobsahuje očekávané typy přepravy.");
}
/** Hlavni kolekce zasilek - prvotne predvyplnena nekolika ukazkami. */
const zasilky = [
    new KrehkyBalik(2.5, 120, "Praha 1, Jindřišská 24", EXPRES, 15000),
    new NadrozmernyBalik(80, 230, "Brno, Veveří 5", CARGO, 2.4),
    new KrehkyBalik(1.2, 80, "Plzeň, Klatovská 12", STANDARD, 4500),
];
// ---------- helpery pro praci s kolekci ----------
/** Smaze zasilku podle ID a prekreslime manifest. */
function smazatZasilku(id) {
    const idx = zasilky.findIndex((z) => z.id === id);
    if (idx >= 0) {
        zasilky.splice(idx, 1);
        prerender();
    }
}
/** Pridame zasilku do kolekce a prekreslime manifest. */
function pridatZasilku(z) {
    zasilky.push(z);
    prerender();
}
/** Centralni rerender - pri kazde zmene kolekce ho zavolame. */
function prerender() {
    vykresliManifest(zasilky, smazatZasilku);
}
// ---------- formular ----------
/**
 * Prepinaci logika mezi typem balku - ukaze pole 'hodnota zbozi'
 * pro krehky, 'delka' pro nadrozmerny, druhe schove.
 */
function nastavViditelnostPoli() {
    const krehky = (document.querySelector("input[name='typ-baliku']:checked")?.value === "krehky");
    const poleHodnota = document.querySelector("#pole-hodnota");
    const poleDelka = document.querySelector("#pole-delka");
    if (poleHodnota)
        poleHodnota.hidden = !krehky;
    if (poleDelka)
        poleDelka.hidden = krehky;
}
/**
 * Vyzobne hodnoty z formulare a zkusi vyrobit objekt Zasilka.
 * V pripade chyby (validace v setteru / konstruktoru) vyhodi vyjimku.
 */
function vyrobZasilkuZFormulare() {
    const adresa = (document.querySelector("#vstup-adresa")?.value ?? "").trim();
    const vaha = Number(document.querySelector("#vstup-vaha")?.value);
    const vzdalenost = Number(document.querySelector("#vstup-vzdalenost")?.value);
    const idPrepravy = document.querySelector("#vstup-preprava")?.value ?? "";
    const typBaliku = document.querySelector("input[name='typ-baliku']:checked")?.value ?? "";
    const typPrepravy = najdiTypPrepravy(idPrepravy);
    if (!typPrepravy) {
        throw new Error("Vyberte platný typ přepravy.");
    }
    if (typBaliku === "krehky") {
        const hodnota = Number(document.querySelector("#vstup-hodnota")?.value);
        // Konstruktor + settery si validaci zaridi sami a pripadne hodi chybu.
        return new KrehkyBalik(vaha, vzdalenost, adresa, typPrepravy, hodnota);
    }
    else if (typBaliku === "nadrozmerny") {
        const delka = Number(document.querySelector("#vstup-delka")?.value);
        return new NadrozmernyBalik(vaha, vzdalenost, adresa, typPrepravy, delka);
    }
    throw new Error("Vyberte typ balíku.");
}
/** Hlavni handler odeslani formulare. */
function onSubmitFormulare(event) {
    event.preventDefault();
    const chyba = document.querySelector("#form-error");
    if (chyba)
        chyba.textContent = "";
    try {
        const novaZasilka = vyrobZasilkuZFormulare();
        pridatZasilku(novaZasilka);
        // Po uspesnem pridani vyresetujeme formular, ale ponechame vybrany
        // typ prepravy a typ baliku - vetsina uzivatelu pridava vice zasilek
        // se stejnym nastavenim za sebou.
        const form = event.currentTarget;
        const adresa = form.querySelector("#vstup-adresa");
        const vaha = form.querySelector("#vstup-vaha");
        const vzdal = form.querySelector("#vstup-vzdalenost");
        const hodnota = form.querySelector("#vstup-hodnota");
        const delka = form.querySelector("#vstup-delka");
        if (adresa)
            adresa.value = "";
        if (vaha)
            vaha.value = "";
        if (vzdal)
            vzdal.value = "";
        if (hodnota)
            hodnota.value = "";
        if (delka)
            delka.value = "";
        adresa?.focus();
    }
    catch (e) {
        if (chyba && e instanceof Error) {
            chyba.textContent = e.message;
        }
    }
}
// ---------- bootstrap ----------
function init() {
    naplnSelectPrepravy(KATALOG_PREPRAVY);
    nastavViditelnostPoli();
    // Prepinani poli pri zmene typu baliku
    document.querySelectorAll("input[name='typ-baliku']").forEach((radio) => {
        radio.addEventListener("change", nastavViditelnostPoli);
    });
    // Submit formulare
    const form = document.querySelector("#form-pridat");
    form?.addEventListener("submit", onSubmitFormulare);
    // Prvni vykresleni
    prerender();
    console.info("Načteno typů přepravy:", KATALOG_PREPRAVY.length);
    console.info("Načteno zásilek:", zasilky.length);
}
// Vyckame na DOMContentLoaded - pro jistotu, kdyby skript byl nahran drive.
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
}
else {
    init();
}
//# sourceMappingURL=main.js.map