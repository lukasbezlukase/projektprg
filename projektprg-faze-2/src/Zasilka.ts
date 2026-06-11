import { TypPrepravy } from "./data.js";

/**
 * Abstraktni bazova trida pro vsechny zasilky v terminalu.
 *
 * Drzi spolecna data (id, vaha, vzdalenost, adresa, zvolena preprava)
 * a predpisuje potomkum metody, ktere se chovaji odlisne podle typu balku
 * (vypoctiCenu, typBalku) - to je misto, kde do hry vstupuje polymorfismus.
 */
export abstract class Zasilka {
    /** Spolecny citac ID - kazda nova zasilka dostane unikatni cislo. */
    private static dalsiId: number = 1;

    public readonly id: number;

    // Atributy jsou protected, aby k nim mely pristup potomci,
    // ale z venku se k nim chodi jen pres gettery/settery.
    protected _vahaKg: number;
    protected _vzdalenostKm: number;
    protected _cilovaAdresa: string;
    protected _typPrepravy: TypPrepravy;

    constructor(
        vahaKg: number,
        vzdalenostKm: number,
        cilovaAdresa: string,
        typPrepravy: TypPrepravy
    ) {
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

    public get vahaKg(): number {
        return this._vahaKg;
    }
    public set vahaKg(hodnota: number) {
        if (!Number.isFinite(hodnota) || hodnota <= 0) {
            throw new Error("Váha musí být kladné číslo.");
        }
        this._vahaKg = hodnota;
    }

    public get vzdalenostKm(): number {
        return this._vzdalenostKm;
    }
    public set vzdalenostKm(hodnota: number) {
        if (!Number.isFinite(hodnota) || hodnota <= 0) {
            throw new Error("Vzdálenost musí být kladné číslo.");
        }
        this._vzdalenostKm = hodnota;
    }

    public get cilovaAdresa(): string {
        return this._cilovaAdresa;
    }
    public set cilovaAdresa(hodnota: string) {
        const trim = hodnota.trim();
        if (trim.length === 0) {
            throw new Error("Cílová adresa nesmí být prázdná.");
        }
        this._cilovaAdresa = trim;
    }

    public get nazevPrepravy(): string {
        return this._typPrepravy.nazev;
    }

    // -------------------- spolecny vypocet --------------------

    /**
     * Spolecny zaklad ceny (vaha * cena/kg + vzdalenost * cena/km).
     * Potomci ho pouziji ve sve vlastni implementaci vypoctiCenu()
     * a pripoctou k nemu specificke priplatky.
     */
    protected zakladniCena(): number {
        return (
            this._vahaKg * this._typPrepravy.cenaZaKg +
            this._vzdalenostKm * this._typPrepravy.cenaZaKm
        );
    }

    // -------------------- abstraktni metody --------------------

    /**
     * Vypocet finalni ceny vcetne specifickych priplatku daneho typu balku.
     * Implementuji potomci - to je hlavni misto polymorfismu.
     */
    public abstract vypoctiCenu(): number;

    /** Lidsky nazev typu balku (napr. "Krehky", "Nadrozmerny"). */
    public abstract typBalku(): string;
}
