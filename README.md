# Logistický terminál

Školní projekt do předmětu Programování. Plně funkční webová aplikace pro
evidenci a expedici zásilek napsaná v TypeScriptu, postavená na objektově
orientovaném návrhu (abstraktní bázová třída + dva potomci, polymorfismus,
oddělená data v číselníku).

## Téma

Logistická firma odbavuje různé typy balíků (**křehké** – pojištění + speciální
balné, **nadrozměrné** – manipulační příplatek + cena dle délky) a počítá cenu
přepravy podle vybrané přepravní služby (Standard / Expres / Cargo, ceník v
souboru `src/data.ts`).

## Funkce

- Formulář pro vložení zásilky s validací (chybové pole se zvýrazní červeně,
  hláška se sama smaže při opravě).
- Dynamický manifest – po každém přidání / smazání zásilky se tabulka i souhrn
  překreslí.
- Souhrn manifestu: počet zásilek, počty podle typu, celková váha a celková
  cena přepravy.
- Smazání zásilky tlačítkem na řádku.
- Responzivní layout – na mobilu jednosloupcový formulář a horizontálně
  scrollovatelná tabulka.

## Architektura (OOP)

```
Zasilka  (abstract)
├── KrehkyBalik       (pojištění 5 % + paušál 80 Kč za balné)
└── NadrozmernyBalik  (manipulace 250 Kč + 60 Kč/m délky)
```

- `Zasilka` drží společné atributy a vystavuje **abstraktní metody**
  `vypoctiCenu()` a `typBalku()`.
- Validace probíhá v setterech – z venku se k atributům nedá dostat bez
  kontroly hodnot (zapouzdření).
- Aplikace pracuje s polem typu `Zasilka[]`, ale obsahuje mix obou potomků;
  vykreslování i sumace ceny zavolá `vypoctiCenu()` na bázi a runtime sám
  vybere správnou implementaci (**polymorfismus**).
- Datový číselník `KATALOG_PREPRAVY` v `src/data.ts` je pouze pro čtení –
  aplikace nikdy neupravuje "ceník", pracuje s ním jako se zdrojem informací.

## Struktura souborů

```
src/
├── data.ts             - číselník přepravních služeb + helper najdiTypPrepravy
├── Zasilka.ts          - abstraktní bázová třída
├── KrehkyBalik.ts      - potomek pro křehké zásilky
├── NadrozmernyBalik.ts - potomek pro nadrozměrné zásilky
├── render.ts           - vykreslování manifestu, souhrnu a naplnění selectu
└── main.ts             - vstupní bod, drží stav kolekce a obsluhu formuláře

dist/                   - výsledek překladu (commitnutý kvůli snadnému spuštění)
index.html              - HTML stránka (UI)
styles.css              - styly
```

## Spuštění

```bash
npm install
npm run build
```

Poté otevřít `index.html` v prohlížeči (např. přes Live Server v VS Code).
Repozitář obsahuje i hotový `dist/`, takže pro pouhé prohlédnutí stačí otevřít
`index.html` přímo, bez instalace závislostí.

## Stav projektu

- [x] **Fáze 1** – návrh OOP architektury, datový číselník, statické vykreslení manifestu
- [x] **Fáze 2** – formulář pro přidávání zásilek, dynamický rerender, mazání položek
- [x] **Fáze 3** – souhrn, inline validace s vyznačením polí, responzivita, finální vzhled
