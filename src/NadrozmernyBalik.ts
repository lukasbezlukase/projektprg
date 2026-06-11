import { Zasilka } from "./Zasilka.js";
import { TypPrepravy } from "./data.js";

/**
 * Nadrozmerny balik - zasilka, ktera presahuje bezne rozmery.
 *
 * Specificke priplatky oproti zakladu:
 *   - pausalni priplatek za rucni manipulaci (vysokozdvih, vetsi prostor v autě)
 *   - priplatek odvozeny od delky zasilky (Kc za 1 m)
 */
export class NadrozmernyBalik extends Zasilka {
    /** Pausalni priplatek za manipulaci v Kc. */
    private static readonly PRIPLATEK_MANIPULACE = 250;
    /** Priplatek za kazdy 1 m delky balku. */
    private static readonly KOEFICIENT_DLE_DELKY = 60;

    private _delkaM: number;

    constructor(
        vahaKg: number,
        vzdalenostKm: number,
        cilovaAdresa: string,
        typPrepravy: TypPrepravy,
        delkaM: number
    ) {
        super(vahaKg, vzdalenostKm, cilovaAdresa, typPrepravy);
        this._delkaM = 0;
        this.delkaM = delkaM;
    }

    public get delkaM(): number {
        return this._delkaM;
    }
    public set delkaM(hodnota: number) {
        if (!Number.isFinite(hodnota) || hodnota <= 0) {
            throw new Error("Délka nadrozměrného balíku musí být kladná.");
        }
        this._delkaM = hodnota;
    }

    /** Konkretni implementace - zaklad + manipulace + priplatek dle delky. */
    public vypoctiCenu(): number {
        const dleDelky = this._delkaM * NadrozmernyBalik.KOEFICIENT_DLE_DELKY;
        return this.zakladniCena() + NadrozmernyBalik.PRIPLATEK_MANIPULACE + dleDelky;
    }

    public typBalku(): string {
        return "Nadrozměrný";
    }
}
