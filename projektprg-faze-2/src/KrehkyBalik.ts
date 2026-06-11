import { Zasilka } from "./Zasilka.js";
import { TypPrepravy } from "./data.js";

/**
 * Krehky balik - zasilka s deklarovanou hodnotou zbozi.
 *
 * Specificke priplatky oproti zakladu:
 *   - pojisteni 5 % z deklarovane hodnoty zbozi
 *   - pausalni priplatek za specialni balne (vystelka, "FRAGILE" znacky)
 */
export class KrehkyBalik extends Zasilka {
    /** Pojistne jako procento z hodnoty zbozi (5 %). */
    private static readonly POJISTNE_PROCENTO = 0.05;
    /** Pausalni priplatek za specialni balne v Kc. */
    private static readonly CENA_BALNE = 80;

    private _hodnotaZbozi: number;

    constructor(
        vahaKg: number,
        vzdalenostKm: number,
        cilovaAdresa: string,
        typPrepravy: TypPrepravy,
        hodnotaZbozi: number
    ) {
        super(vahaKg, vzdalenostKm, cilovaAdresa, typPrepravy);
        this._hodnotaZbozi = 0;
        this.hodnotaZbozi = hodnotaZbozi;
    }

    public get hodnotaZbozi(): number {
        return this._hodnotaZbozi;
    }
    public set hodnotaZbozi(hodnota: number) {
        if (!Number.isFinite(hodnota) || hodnota <= 0) {
            throw new Error("Hodnota zboží u křehkého balíku musí být kladná.");
        }
        this._hodnotaZbozi = hodnota;
    }

    /** Konkretni implementace - zaklad + pojisteni + balne. */
    public vypoctiCenu(): number {
        const pojisteni = this._hodnotaZbozi * KrehkyBalik.POJISTNE_PROCENTO;
        return this.zakladniCena() + pojisteni + KrehkyBalik.CENA_BALNE;
    }

    public typBalku(): string {
        return "Křehký";
    }
}
