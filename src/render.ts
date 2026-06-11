/**
 * Vykreslovaci modul - oddeleny od hlavni logiky aplikace.
 *
 * Obsahuje funkce, ktere prevadi stav (pole zasilek, vybrany typ baliku,
 * katalog prepravy) na zmeny v DOMu. Hlavni dukaz polymorfismu zustava
 * v vykresliManifest() - pres pole Zasilka[] se vola vypoctiCenu()
 * i typBalku() bez rozliseni konkretni podtridy.
 */

import { Zasilka } from "./Zasilka.js";
import { KrehkyBalik } from "./KrehkyBalik.js";
import { NadrozmernyBalik } from "./NadrozmernyBalik.js";
import { TypPrepravy } from "./data.js";

/** Callback volany pri kliknuti na tlacitko Smazat na konkretnim radku. */
export type OnSmazatHandler = (id: number) => void;

/**
 * Vykresli manifest zasilek do tabulky #manifest-body.
 *
 * @param seznam        kolekce zasilek (mix krehkych a nadrozmernych)
 * @param onSmazat      callback volany pri kliknuti na "Smazat"
 */
export function vykresliManifest(
    seznam: ReadonlyArray<Zasilka>,
    onSmazat: OnSmazatHandler
): void {
    const telo = document.querySelector<HTMLTableSectionElement>("#manifest-body");
    if (!telo) {
        console.error("V HTML chybí element #manifest-body.");
        return;
    }

    telo.innerHTML = "";

    if (seznam.length === 0) {
        const radek = document.createElement("tr");
        radek.innerHTML = `<td colspan="8" class="prazdny-stav">Manifest je prázdný. Přidejte zásilku formulářem výše.</td>`;
        telo.appendChild(radek);
        return;
    }

    for (const zasilka of seznam) {
        const radek = document.createElement("tr");

        // Polymorfismus v praxi - typBalku() i vypoctiCenu() jsou abstraktni
        // metody bazove tridy, runtime vola implementaci konkretniho potomka.
        radek.innerHTML = `
            <td>${zasilka.id}</td>
            <td>${zasilka.typBalku()}</td>
            <td>${zasilka.cilovaAdresa}</td>
            <td>${zasilka.vahaKg.toFixed(2)} kg</td>
            <td>${zasilka.vzdalenostKm} km</td>
            <td>${zasilka.nazevPrepravy}</td>
            <td>${zasilka.vypoctiCenu().toFixed(2)} Kč</td>
            <td><button type="button" class="btn-smazat" data-id="${zasilka.id}" aria-label="Smazat zásilku ${zasilka.id}">×</button></td>
        `;
        telo.appendChild(radek);
    }

    // Po vykresleni navazeme handlery na vsechna mazaci tlacitka.
    // Pristup pres delegaci by sel taky, ale pri male tabulce je toto citelnejsi.
    telo.querySelectorAll<HTMLButtonElement>(".btn-smazat").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset["id"]);
            if (Number.isFinite(id)) {
                onSmazat(id);
            }
        });
    });
}

/**
 * Naplni <select> moznostmi z ciselniku prepravy.
 * Volat po nacteni stranky pred prvnim submitem formulare.
 */
export function naplnSelectPrepravy(katalog: ReadonlyArray<TypPrepravy>): void {
    const select = document.querySelector<HTMLSelectElement>("#vstup-preprava");
    if (!select) {
        console.error("V HTML chybí element #vstup-preprava.");
        return;
    }

    select.innerHTML = "";
    for (const typ of katalog) {
        const option = document.createElement("option");
        option.value = typ.id;
        option.textContent = `${typ.nazev} (${typ.cenaZaKg} Kč/kg, ${typ.cenaZaKm} Kč/km)`;
        option.title = typ.popis;
        select.appendChild(option);
    }
}

/**
 * Spocita souhrn z kolekce a vykresli ho do karet sekce #souhrn-manifestu.
 *
 * Pocet polozek podle typu se zjistuje pres instanceof - to je dalsi vyuziti
 * polymorfni hierarchie (umime rozlisit potomky bazove tridy bez nejakeho
 * 'discriminator' atributu).
 */
export function vykresliSouhrn(seznam: ReadonlyArray<Zasilka>): void {
    let pocetKrehkych = 0;
    let pocetNadrozmernych = 0;
    let celkovaVaha = 0;
    let celkovaCena = 0;

    for (const zasilka of seznam) {
        celkovaVaha += zasilka.vahaKg;
        celkovaCena += zasilka.vypoctiCenu();
        if (zasilka instanceof KrehkyBalik) {
            pocetKrehkych += 1;
        } else if (zasilka instanceof NadrozmernyBalik) {
            pocetNadrozmernych += 1;
        }
    }

    setText("#souhrn-pocet", String(seznam.length));
    setText("#souhrn-krehke", String(pocetKrehkych));
    setText("#souhrn-nadrozmerne", String(pocetNadrozmernych));
    setText("#souhrn-vaha", `${celkovaVaha.toFixed(2)} kg`);
    setText("#souhrn-cena", `${celkovaCena.toFixed(2)} Kč`);
}

/** Pomocny shortcut - nastavi text obsahu elementu nalezeneho pres selektor. */
function setText(selektor: string, hodnota: string): void {
    const el = document.querySelector<HTMLElement>(selektor);
    if (el) el.textContent = hodnota;
}
