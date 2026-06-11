/**
 * Abstraktni bazova trida pro vsechny zasilky v terminalu.
 *
 * Drzi spolecna data (id, vaha, vzdalenost, adresa, zvolena preprava)
 * a predpisuje potomkum metody, ktere se chovaji odlisne podle typu balku
 * (vypoctiCenu, typBalku) - to je misto, kde do hry vstupuje polymorfismus.
 */
export class Zasilka {
    constructor(vahaKg, vzdalenostKm, cilovaAdresa, typPrepravy) {
        this.id = Zasilka.dalsiId++;
        // Pres settery zarucim, ze hodnoty projdou validaci i pri konstrukci.
        this._vahaKg = 0;
        this._vzdalenostKm = 0;
        this._cilovaAdresa = "";
        this._typPrepravy = typPrepravy;
        this.vahaKg = vahaKg;
        this.vzdalenostKm = vzdalenostKm;
        this.cilovaAdresa = cilovaAdresa;
    }
    // -------------------- gettery / settery --------------------
    get vahaKg() {
        return this._vahaKg;
    }
    set vahaKg(hodnota) {
        if (!Number.isFinite(hodnota) || hodnota <= 0) {
            throw new Error("Váha musí být kladné číslo.");
        }
        this._vahaKg = hodnota;
    }
    get vzdalenostKm() {
        return this._vzdalenostKm;
    }
    set vzdalenostKm(hodnota) {
        if (!Number.isFinite(hodnota) || hodnota <= 0) {
            throw new Error("Vzdálenost musí být kladné číslo.");
        }
        this._vzdalenostKm = hodnota;
    }
    get cilovaAdresa() {
        return this._cilovaAdresa;
    }
    set cilovaAdresa(hodnota) {
        const trim = hodnota.trim();
        if (trim.length === 0) {
            throw new Error("Cílová adresa nesmí být prázdná.");
        }
        this._cilovaAdresa = trim;
    }
    get nazevPrepravy() {
        return this._typPrepravy.nazev;
    }
    // -------------------- spolecny vypocet --------------------
    /**
     * Spolecny zaklad ceny (vaha * cena/kg + vzdalenost * cena/km).
     * Potomci ho pouziji ve sve vlastni implementaci vypoctiCenu()
     * a pripoctou k nemu specificke priplatky.
     */
    zakladniCena() {
        return (this._vahaKg * this._typPrepravy.cenaZaKg +
            this._vzdalenostKm * this._typPrepravy.cenaZaKm);
    }
}
/** Spolecny citac ID - kazda nova zasilka dostane unikatni cislo. */
Zasilka.dalsiId = 1;
//# sourceMappingURL=Zasilka.js.map