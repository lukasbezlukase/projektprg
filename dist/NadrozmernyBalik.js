import { Zasilka } from "./Zasilka.js";
/**
 * Nadrozmerny balik - zasilka, ktera presahuje bezne rozmery.
 *
 * Specificke priplatky oproti zakladu:
 *   - pausalni priplatek za rucni manipulaci (vysokozdvih, vetsi prostor v autě)
 *   - priplatek odvozeny od delky zasilky (Kc za 1 m)
 */
export class NadrozmernyBalik extends Zasilka {
    constructor(vahaKg, vzdalenostKm, cilovaAdresa, typPrepravy, delkaM) {
        super(vahaKg, vzdalenostKm, cilovaAdresa, typPrepravy);
        this._delkaM = 0;
        this.delkaM = delkaM;
    }
    get delkaM() {
        return this._delkaM;
    }
    set delkaM(hodnota) {
        if (!Number.isFinite(hodnota) || hodnota <= 0) {
            throw new Error("Délka nadrozměrného balíku musí být kladná.");
        }
        this._delkaM = hodnota;
    }
    /** Konkretni implementace - zaklad + manipulace + priplatek dle delky. */
    vypoctiCenu() {
        const dleDelky = this._delkaM * NadrozmernyBalik.KOEFICIENT_DLE_DELKY;
        return this.zakladniCena() + NadrozmernyBalik.PRIPLATEK_MANIPULACE + dleDelky;
    }
    typBalku() {
        return "Nadrozměrný";
    }
}
/** Pausalni priplatek za manipulaci v Kc. */
NadrozmernyBalik.PRIPLATEK_MANIPULACE = 250;
/** Priplatek za kazdy 1 m delky balku. */
NadrozmernyBalik.KOEFICIENT_DLE_DELKY = 60;
//# sourceMappingURL=NadrozmernyBalik.js.map