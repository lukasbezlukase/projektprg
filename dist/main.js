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
import { StandardniBalik } from "./StandardniBalik.js";
import { vykresliManifest, naplnSelectPrepravy, vykresliSouhrn } from "./render.js";
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
    vykresliSouhrn(zasilky);
}
// ---------- formular ----------
/**
 * Prepinaci logika mezi typem balku - ukaze pole 'hodnota zbozi'
 * pro krehky, 'delka' pro nadrozmerny, druhe schove.
 */
function nastavViditelnostPoli() {
    const typ = document.querySelector("input[name='typ-baliku']:checked")?.value ?? "";
    const poleHodnota = document.querySelector("#pole-hodnota");
    const poleDelka = document.querySelector("#pole-delka");
    if (poleHodnota)
        poleHodnota.hidden = (typ !== "krehky");
    if (poleDelka)
        poleDelka.hidden = (typ !== "nadrozmerny");
}
/** Chyby validace ve formulari - drzi pole {id pole, hlaska}. */
class ValidacniChyba extends Error {
    constructor(polozky) {
        super(polozky.map((p) => p.zprava).join(" "));
        this.polozky = polozky;
        this.name = "ValidacniChyba";
    }
}
/** Vrati cislo z inputu nebo NaN, pokud je prazdny / neplatny. */
function cisloZInputu(selektor) {
    const raw = document.querySelector(selektor)?.value ?? "";
    if (raw.trim() === "")
        return NaN;
    return Number(raw);
}
/**
 * Validuje hodnoty z formulare po polich a vyrobi instanci Zasilka.
 *
 * Validace se dela predem (ne az v setterech), aby slo chyby pripsat
 * konkretnimu inputu a ten zvyraznit. Settery v tridach pak slouzi
 * jako safety net - pokud by se snad data dostala odjinud nez z formulare,
 * stale se nepusti dovnitr neplatna zasilka.
 */
function vyrobZasilkuZFormulare() {
    const chyby = [];
    const adresa = (document.querySelector("#vstup-adresa")?.value ?? "").trim();
    if (adresa.length === 0) {
        chyby.push({ id: "vstup-adresa", zprava: "Vyplňte cílovou adresu." });
    }
    const vaha = cisloZInputu("#vstup-vaha");
    if (!Number.isFinite(vaha) || vaha <= 0) {
        chyby.push({ id: "vstup-vaha", zprava: "Váha musí být kladné číslo (kg)." });
    }
    const vzdalenost = cisloZInputu("#vstup-vzdalenost");
    if (!Number.isFinite(vzdalenost) || vzdalenost <= 0) {
        chyby.push({ id: "vstup-vzdalenost", zprava: "Vzdálenost musí být kladné číslo (km)." });
    }
    const idPrepravy = document.querySelector("#vstup-preprava")?.value ?? "";
    const typPrepravy = najdiTypPrepravy(idPrepravy);
    if (!typPrepravy) {
        chyby.push({ id: "vstup-preprava", zprava: "Vyberte typ přepravy z nabídky." });
    }
    const typBaliku = document.querySelector("input[name='typ-baliku']:checked")?.value ?? "";
    let hodnota = NaN;
    let delka = NaN;
    if (typBaliku === "krehky") {
        hodnota = cisloZInputu("#vstup-hodnota");
        if (!Number.isFinite(hodnota) || hodnota <= 0) {
            chyby.push({ id: "vstup-hodnota", zprava: "Vyplňte deklarovanou hodnotu zboží." });
        }
    }
    else if (typBaliku === "nadrozmerny") {
        delka = cisloZInputu("#vstup-delka");
        if (!Number.isFinite(delka) || delka <= 0) {
            chyby.push({ id: "vstup-delka", zprava: "Vyplňte délku balíku v metrech." });
        }
    }
    // standardni - zadne extra pole
    if (chyby.length > 0 || !typPrepravy) {
        throw new ValidacniChyba(chyby);
    }
    if (typBaliku === "krehky") {
        return new KrehkyBalik(vaha, vzdalenost, adresa, typPrepravy, hodnota);
    }
    if (typBaliku === "nadrozmerny") {
        return new NadrozmernyBalik(vaha, vzdalenost, adresa, typPrepravy, delka);
    }
    return new StandardniBalik(vaha, vzdalenost, adresa, typPrepravy);
}
/** Vyznaci pole jako neplatne (cervene orámování). */
function oznacNeplatne(polozky) {
    for (const polozka of polozky) {
        const el = document.getElementById(polozka.id);
        if (el) {
            el.classList.add("neplatne");
            el.setAttribute("aria-invalid", "true");
        }
    }
}
/** Vycisti vsechny vyznaceni neplatnosti ve formulari. */
function smazOznaceniChyb() {
    document.querySelectorAll("#form-pridat .neplatne").forEach((el) => {
        el.classList.remove("neplatne");
        el.removeAttribute("aria-invalid");
    });
    const chyba = document.querySelector("#form-error");
    if (chyba)
        chyba.textContent = "";
}
/** Hlavni handler odeslani formulare. */
function onSubmitFormulare(event) {
    event.preventDefault();
    smazOznaceniChyb();
    const chyba = document.querySelector("#form-error");
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
        if (e instanceof ValidacniChyba) {
            oznacNeplatne(e.polozky);
            if (chyba) {
                chyba.textContent = e.polozky.length === 1
                    ? e.polozky[0].zprava
                    : `Opravte ${e.polozky.length} polí ve formuláři.`;
            }
            // Skok kurzoru do prvniho problemoveho pole pro pohodlne opraveni.
            const prvni = e.polozky[0];
            if (prvni) {
                document.getElementById(prvni.id)?.focus();
            }
        }
        else if (chyba && e instanceof Error) {
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
    // Pri zacatku psani v jakemkoli poli zrusime zvyrazneni chyby - lepsi UX,
    // uzivatel hned vidi ze je to OK a nemusi nic resetovat rucne.
    form?.addEventListener("input", (ev) => {
        const cil = ev.target;
        if (cil && cil.classList.contains("neplatne")) {
            cil.classList.remove("neplatne");
            cil.removeAttribute("aria-invalid");
        }
    });
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