import { Zasilka } from "./Zasilka.js";
/**
 * Standardni balik - bezna zasilka bez specialnich pozadavku.
 *
 * Cena je pouze zakladni (vaha * cena/kg + vzdalenost * cena/km),
 * zadne priplatky se nepripocitavaji.
 */
export class StandardniBalik extends Zasilka {
    constructor(vahaKg, vzdalenostKm, cilovaAdresa, typPrepravy) {
        super(vahaKg, vzdalenostKm, cilovaAdresa, typPrepravy);
    }

    /** Pouze zakladni cena - zadne priplatky. */
    vypoctiCenu() {
        return this.zakladniCena();
    }

    typBalku() {
        return "Standardní";
    }
}
//# sourceMappingURL=StandardniBalik.js.map
