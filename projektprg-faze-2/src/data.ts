/**
 * Datovy ciselnik - "oficialni cenik" prepravnich sluzeb.
 *
 * Soubor je zamerne oddeleny od logiky aplikace. Aplikace s nim pracuje
 * jen pro cteni - pri zmene ceny nebo pridani nove polozky se zbytek
 * kodu nemusi upravovat.
 */

/** Jeden zaznam z ceniku. */
export interface TypPrepravy {
    /** Krátký kód (např. "STD"), slouží jako identifikátor v selectu. */
    readonly id: string;
    /** Lidský název přepravy. */
    readonly nazev: string;
    /** Cena za 1 kg váhy zásilky (Kč). */
    readonly cenaZaKg: number;
    /** Cena za 1 km přepravy (Kč). */
    readonly cenaZaKm: number;
    /** Krátký popis pro UI. */
    readonly popis: string;
}

/**
 * Cenik prepravnich sluzeb. Zde se da klidne pridat dalsi typ prepravy
 * a aplikace si ho nacte automaticky (formular ve fazi 2 z toho nataha
 * polozky do <select>).
 */
export const KATALOG_PREPRAVY: ReadonlyArray<TypPrepravy> = [
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
export function najdiTypPrepravy(id: string): TypPrepravy | undefined {
    return KATALOG_PREPRAVY.find((typ) => typ.id === id);
}
