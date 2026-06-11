import { Zasilka } from "./Zasilka.js";
/**
 * Krehky balik - zasilka s deklarovanou hodnotou zbozi.
 *
 * Specificke priplatky oproti zakladu:
 *   - pojisteni 5 % z deklarovane hodnoty zbozi
 *   - pausalni priplatek za specialni balne (vystelka, "FRAGILE" znacky)
 */
export class KrehkyBalik extends Zasilka {
    constructor(vahaKg, vzdalenostKm, cilovaAdresa, typPrepravy, hodnotaZbozi) {
        super(vahaKg, vzdalenostKm, cilovaAdresa, typPrepravy);
        this._hodnotaZbozi = 0;
        this.hodnotaZbozi = hodnotaZbozi;
    }
    get hodnotaZbozi() {
        return this._hodnotaZbozi;
    }
    set hodnotaZbozi(hodnota) {
        if (!Number.isFinite(hodnota) || hodnota <= 0) {
            throw new Error("Hodnota zboží u křehkého balíku musí být kladná.");
        }
        this._hodnotaZbozi = hodnota;
    }
    /** Konkretni implementace - zaklad + pojisteni + balne. */
    vypoctiCenu() {
        const pojisteni = this._hodnotaZbozi * KrehkyBalik.POJISTNE_PROCENTO;
        return this.zakladniCena() + pojisteni + KrehkyBalik.CENA_BALNE;
    }
    typBalku() {
        return "Křehký";
    }
}
/** Pojistne jako procento z hodnoty zbozi (5 %). */
KrehkyBalik.POJISTNE_PROCENTO = 0.05;
/** Pausalni priplatek za specialni balne v Kc. */
KrehkyBalik.CENA_BALNE = 80;
//# sourceMappingURL=KrehkyBalik.js.map