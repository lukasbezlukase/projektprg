/**
 * Datovy ciselnik - "oficialni cenik" prepravnich sluzeb.
 *
 * Soubor je zamerne oddeleny od logiky aplikace. Aplikace s nim pracuje
 * jen pro cteni - pri zmene ceny nebo pridani nove polozky se zbytek
 * kodu nemusi upravovat.
 */
/**
 * Cenik prepravnich sluzeb. Zde se da klidne pridat dalsi typ prepravy
 * a aplikace si ho nacte automaticky (formular ve fazi 2 z toho nataha
 * polozky do <select>).
 */
export const KATALOG_PREPRAVY = [
    {
        id: "STD",
        nazev: "Standard",
        cenaZaKg: 12,
        cenaZaKm: 8,
        popis: "Doručení do 5 pracovních dnů",
    },
    {
        id: "EXP",
        nazev: "Expres",
        cenaZaKg: 25,
        cenaZaKm: 14,
        popis: "Doručení následující pracovní den",
    },
    {
        id: "CRG",
        nazev: "Cargo",
        cenaZaKg: 8,
        cenaZaKm: 5,
        popis: "Hromadná přeprava, vhodná pro váhy nad 50 kg",
    },
];
/**
 * Pomocna funkce - vyhleda typ prepravy podle ID.
 * Vraci undefined, pokud zaznam neexistuje (volajici musi osetrit).
 */
export function najdiTypPrepravy(id) {
    return KATALOG_PREPRAVY.find((typ) => typ.id === id);
}
//# sourceMappingURL=data.js.map