/**
 * Vstupni bod aplikace.
 *
 * FAZE 1 - jen overeni, ze trida + potomci + ciselnik fungujou dohromady.
 * Vyrobime par hardcoded zasilek a vykreslime je do tabulky #manifest-body.
 * Formular pro pridavani novych polozek prijde ve fazi 2.
 */

import { KATALOG_PREPRAVY, najdiTypPrepravy } from "./data.js";
import { Zasilka } from "./Zasilka.js";
import { KrehkyBalik } from "./KrehkyBalik.js";
import { NadrozmernyBalik } from "./NadrozmernyBalik.js";

// Pomocne reference do ciselniku - kdyz nejaky zaznam chybi, padne to hned tady
// pri startu, ne pozdeji nekde uprostred vykreslovani.
const STANDARD = najdiTypPrepravy("STD");
const EXPRES = najdiTypPrepravy("EXP");
const CARGO = najdiTypPrepravy("CRG");
if (!STANDARD || !EXPRES || !CARGO) {
    throw new Error("Datový číselník neobsahuje očekávané typy přepravy.");
}

/**
 * Kolekce zasilek - klicovy bod polymorfismu.
 *
 * Pole je typu Zasilka[], ale obsahuje mix KrehkyBalik a NadrozmernyBalik.
 * Pri vykresleni voláme vypoctiCenu()/typBalku() na bázové třídě a runtime
 * si sám zvolí správnou implementaci podle skutečného typu objektu.
 */
const zasilky: Zasilka[] = [
    new KrehkyBalik(2.5, 120, "Praha 1, Jindřišská 24", EXPRES, 15000),
    new NadrozmernyBalik(80, 230, "Brno, Veveří 5", CARGO, 2.4),
    new KrehkyBalik(1.2, 80, "Plzeň, Klatovská 12", STANDARD, 4500),
    new NadrozmernyBalik(45, 310, "Ostrava, Nádražní 18", CARGO, 1.8),
];

/**
 * Vykresli manifest do tabulky.
 * Funkce zameuje pouze radky tbody - hlavicka tabulky je staticka v HTML.
 */
function vykresliManifest(seznam: ReadonlyArray<Zasilka>): void {
    const telo = document.querySelector<HTMLTableSectionElement>("#manifest-body");
    if (!telo) {
        // V produkci by tady byl logger; pro skolni projekt staci konzole.
        console.error("V HTML chybí element #manifest-body.");
        return;
    }

    telo.innerHTML = "";

    for (const zasilka of seznam) {
        const radek = document.createElement("tr");

        // Polymorfismus: tady volame metody bazove tridy, ale JS vola
        // implementaci konkretni podtridy (KrehkyBalik / NadrozmernyBalik).
        radek.innerHTML = `
            <td>${zasilka.id}</td>
            <td>${zasilka.typBalku()}</td>
            <td>${zasilka.cilovaAdresa}</td>
            <td>${zasilka.vahaKg.toFixed(2)} kg</td>
            <td>${zasilka.vzdalenostKm} km</td>
            <td>${zasilka.nazevPrepravy}</td>
            <td>${zasilka.vypoctiCenu().toFixed(2)} Kč</td>
        `;
        telo.appendChild(radek);
    }
}

// Pri prvnim nacteni vykreslime hardcoded ukazku.
// Ve fazi 2 se sem prida i renderovani pri zmene formulare / pridani polozky.
vykresliManifest(zasilky);

// Pomocny vystup do konzole - usnadnuje rucni overeni vypoctu pri ladeni.
console.info("Načteno typů přepravy:", KATALOG_PREPRAVY.length);
console.info("Načteno zásilek:", zasilky.length);
