# Logistický terminál

Školní projekt do předmětu Programování. Webová aplikace pro evidenci a expedici
zásilek napsaná v TypeScriptu, postavená na objektově orientovaném návrhu
(abstraktní bázová třída + dva potomci, polymorfismus, oddělená data v číselníku).

## Téma

Logistická firma odbavuje různé typy balíků (křehké, nadrozměrné) a počítá
cenu přepravy podle vybrané přepravní služby (Standard / Expres / Cargo).

## Spuštění

```bash
npm install
npm run build
```

Poté otevřít `index.html` v prohlížeči (např. přes Live Server v VS Code).

## Stav projektu

- [x] **Fáze 1** – návrh OOP architektury, datový číselník, statické vykreslení manifestu
- [ ] Fáze 2 – formulář pro přidávání zásilek, dynamický rerender
- [ ] Fáze 3 – souhrn, validace, finální vzhled
