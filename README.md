# AI Maturity Assessment — Onderwijs

Een **self-assessment voor vicedecanen onderwijs** om de AI-volwassenheid van het onderwijs binnen een faculteit in kaart te brengen. De gebruiker beantwoordt 20 stellingen en ontvangt direct een persoonlijk maturiteitsrapport met scores per dimensie, een radardiagram en concrete aanbevelingen.

De tool is een **één-bestands webapplicatie**: er hoeft niets geïnstalleerd te worden en de offline versie werkt volledig zonder internetverbinding.

---

## Inhoud

- [Functies](#functies)
- [De vijf dimensies](#de-vijf-dimensies)
- [Hoe het werkt](#hoe-het-werkt)
- [Maturiteitsniveaus](#maturiteitsniveaus)
- [Bestanden](#bestanden)
- [Gebruik](#gebruik)
- [Privacy](#privacy)
- [Ethische aandachtspunten](#ethische-aandachtspunten)
- [Aanpassen](#aanpassen)
- [Techniek](#techniek)

---

## Functies

- 20 stellingen verdeeld over 5 onderwijsgerichte dimensies
- 5-punts Likert-schaal (helemaal oneens → helemaal eens)
- Directe berekening van een totaalscore (0–100) en scores per dimensie
- Visueel rapport met cirkeldiagram, radardiagram en voortgangsbalken
- Automatische top-3 aanbevelingen op basis van de laagst scorende dimensies
- Werkt in elke moderne browser; **offline versie heeft geen internet nodig**

---

## De vijf dimensies

| Dimensie | Waar het over gaat |
|---|---|
| 🧭 **Onderwijsvisie & Beleid** | Visie op AI, verankering in de OER, doelen voor AI-geletterdheid, betrokkenheid van opleidingsdirecteuren |
| 🖥️ **AI-Tools & Platforms** | Toegang tot én daadwerkelijk gebruik van goedgekeurde AI-onderwijsplatforms, toolrichtlijnen, monitoring |
| 🎓 **Docentcompetenties** | Docentscholing, AI-geletterdheid van personeel, kennisdeling, experimenteercultuur |
| 📚 **Curriculum & Toetsing** | AI-geletterdheidsmodules in curricula, AI-vaardigheden in eindtermen, AI-bestendige toetsvormen |
| ⚖️ **Integriteit & Governance** | AI-fraude en -plagiaat, AI-compliance officers, studentcommunicatie, fraudeprotocol |

Elke dimensie bevat 4 stellingen.

---

## Hoe het werkt

1. **Introductie** — De gebruiker vult optioneel de naam van de faculteit in en start de assessment.
2. **Vragenlijst** — Per stelling kiest de gebruiker een score van 1 tot 5. Een voortgangsbalk toont hoe ver men is.
3. **Rapport** — Na de laatste stelling worden de scores automatisch berekend en gevisualiseerd.

**Berekening:** per dimensie worden de antwoorden opgeteld en gedeeld door het maximum (4 stellingen × 5 punten = 20), wat een percentage van 0–100 oplevert. De totaalscore is het gemiddelde van de vijf dimensiescores.

---

## Maturiteitsniveaus

| Score | Niveau | Betekenis |
|---|---|---|
| 0–20 | **Initieel** | AI staat nog in de kinderschoenen; weinig gestructureerde initiatieven |
| 21–40 | **Verkennend** | Eerste stappen en pilots, maar nog geen coherente aanpak |
| 41–60 | **Ontwikkelend** | Structuur ontstaat; meerdere initiatieven lopen parallel |
| 61–80 | **Gevorderd** | AI is geïntegreerd in processen; schaalbare aanpak aanwezig |
| 81–100 | **Leidend** | De faculteit is een voorbeeld op het gebied van AI-adoptie |

---

## Bestanden

| Bestand | Internet nodig? | Beschrijving |
|---|---|---|
| `ai-maturity-assessment-offline.html` | ❌ Nee | Volledig zelfstandig: React, de gecompileerde app en de lettertypes zitten allemaal in het bestand. **Aanbevolen om te delen.** |
| `ai-maturity-assessment.html` | ✅ Ja | Laadt React en lettertypes via een CDN; alleen bruikbaar met internetverbinding. |
| `ai-maturity-assessment.jsx` | n.v.t. | De React-broncode, bedoeld voor verdere ontwikkeling. |

---

## Gebruik

**Direct openen**

Download `ai-maturity-assessment-offline.html` en dubbelklik het. Het opent in je standaardbrowser en werkt direct — ook zonder netwerk. Je kunt het bestand vrij delen via mail, Teams of een gedeelde map.

**Als webpagina hosten (optioneel)**

Plaats het HTML-bestand op een webserver, SharePoint, of via GitHub Pages:

1. Zet `ai-maturity-assessment-offline.html` in de repository (eventueel hernoemd naar `index.html`).
2. Ga naar **Settings → Pages** en kies de juiste branch.
3. De tool is daarna bereikbaar via de gegenereerde URL.

---

## Privacy

De offline versie is privacyvriendelijk van opzet:

- **Geen dataverkeer** — er wordt niets verzonden of opgehaald; geen tracking, analytics of cookies.
- **Geen opslag** — antwoorden bestaan alleen tijdelijk in het geheugen van de browser en verdwijnen zodra de pagina ververst of gesloten wordt.
- **Geen verwerkingsverantwoordelijke** — omdat er niets wordt opgeslagen of gedeeld, is de AVG-blootstelling binnen de tool minimaal.

**Let op — de risico's zitten *rond* de tool, niet erin:**

- Het rapport bestaat alleen op het scherm. Een screenshot of export wordt een identificeerbaar gegeven (faculteitsnaam + score) dat buiten de privacyveilige omgeving terechtkomt.
- Het verzamelen van resultaten in een spreadsheet (bijv. om faculteiten te vergelijken) creëert alsnog een centrale dataset — zonder de consent-, bewaar- en toegangswaarborgen van een echt systeem.
- De tool toont geen doel- of consentmelding; dat is prima voor private zelfreflectie, maar wordt een aandachtspunt zodra anderen om de resultaten vragen.

---

## Ethische aandachtspunten

Deze wegen zwaarder dan de privacyrisico's en worden **niet** opgelost door het offline-formaat:

- **Zelfrapportage als beoordeling** — een maturiteitsscore die aan een vicedecaan hangt, is makkelijk te hergebruiken als prestatiemeting of ranking. Dat geeft een prikkel om strategisch in plaats van eerlijk te antwoorden, wat de waarde van de tool ondermijnt.
- **Schijnprecisie** — het terugbrengen van een subjectieve vragenlijst tot één getal uit 100 suggereert meetnauwkeurigheid die er niet is. De weging is gelijk en de drempels zijn niet gevalideerd.
- **Ingebouwd waardeoordeel** — de schaal beloont AI-adoptie en noemt het hoogste niveau "leidend". Een faculteit die AI bewust beperkt om pedagogische of integriteitsredenen scoort daardoor laag. Dat is een betwistbaar normatief uitgangspunt.
- **Perverse prikkel bij fraude** — "het aantal AI-fraudegevallen neemt af" wordt als positief gewaardeerd, terwijl minder gevallen ook *slechtere detectie* kan betekenen.
- **Generieke aanbevelingen** — de adviezen zijn op regels gebaseerd, geen expertadvies, maar worden wel stellig gepresenteerd.

**Aanbevolen gebruik:** zet de tool in als hulpmiddel voor *zelfreflectie en gesprek*, niet als meetinstrument of beoordelingsmechanisme. Maak vooraf binnen de faculteit afspraken over hoe resultaten wel en niet gebruikt worden.

---

## Aanpassen

De inhoud staat overzichtelijk bovenaan in `ai-maturity-assessment.jsx`:

- `DIMENSIONS` — labels, iconen en kleuren van de dimensies
- `QUESTIONS` — de stellingen per dimensie
- `MATURITY_LEVELS` — de scoredrempels en omschrijvingen
- `SCALE` — de antwoordschaal

Na aanpassing van de `.jsx` moet de offline HTML opnieuw gebouwd worden (React + JSX-compilatie + ingebedde lettertypes). De online `.html` kun je rechtstreeks aanpassen.

---

## Techniek

- **React 18** voor de interface
- **JSX** vooraf gecompileerd naar gewone JavaScript (offline versie heeft geen runtime-vertaler nodig)
- **Lettertypes** Playfair Display & DM Sans, als data ingebed in de offline versie
- Geen build-tools of dependencies nodig om de HTML te gebruiken


<https://creativecommons.org/licenses/by-nc-nd/4.0/deed.nl>
