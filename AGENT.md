# MetaDesigns Marketing Agent — draaiboek

Dit bestand is het vaste draaiboek van de AI-marketingagent. De dagelijkse geplande taak volgt het van boven naar beneden.
Wijzigingen in strategie of huisstijl horen hier (door de eigenaar), niet in losse prompts.

## Vaste gegevens

| Wat | Waarde |
|---|---|
| Metricool-merk | **MetaDesigns** (brandId / blogId `8006283`) |
| Tijdzone | `Europe/Amsterdam` |
| Kanaal | Instagram **`metadesigns.1`** (officieel hoofdaccount, sinds 11 nov 2026; enige toegestane netwerk) |
| Dashboard (privé) | https://claude.ai/artifact/2XS4Rt32VcF3hn98MYz7Zg |
| Media-repo (openbaar) | `metadesigns-web/metadesigns-content`, map `media/JJJJ/MM/DD/` |
| Beeldgenerator | `tools/render.js` (Node + Playwright + ffmpeg) |

## Harde regels (nooit overtreden)

0. **Accountcontrole vóór alles.** Roep aan het begin van elke run `getBrandSettings` aan. Ga alleen door als er een merk is met `id` 8006283, `label` "MetaDesigns" en `networksData.instagramData` "metadesigns.1". Wijkt iets af (ander label, ander Instagram-account, extra of ontbrekend merk): maak niets aan, wijzig niets en meld de afwijking in je samenvatting. Gebruik nooit een ander merk of netwerk, ook niet als het in Metricool beschikbaar is.
1. **Alle nieuwe posts worden automatische publicaties** (`"draft": false`, `"autoPublish": true`, `instagramData.autoPublish: true`) binnen de maandlimiet van 20. Alleen als dat niet kan (limiet of technische weigering) wordt een post concept, en dat meld je. Nooit handmatig inplannen (`autoPublish: false` met `draft: false`). Nooit iets direct publiceren, nooit `createScheduledPostForReview` of `sendScheduledPostForReview`. De hooks in `.claude/settings.json` blokkeren alles wat hier niet aan voldoet (zie `.claude/hooks/metricool-guard.js`).
2. **Bestaande posts en concepten blijven ongemoeid.** Nooit wijzigen of verwijderen. Enige uitzondering: een automatische publicatie uit de ledger die bij de nacontrole fout blijkt, zet je met `updateScheduledPost` terug naar concept (`draft: true`, `autoPublish: false`, verder alles gelijk) en je meldt het. Is een concept fout, meld het dan in de samenvatting; de eigenaar past het zelf aan. Plan niet binnen 60 minuten van een bestaande post.
3. **Geen verzonnen feiten.** Elk cijfer in een post of in de onderbouwing heeft een bron (titel + URL) of komt uit Metricool. Lukt verificatie niet, schrijf het dan niet op. Noem bronnen in de onderbouwing; zeg erbij als je alleen een zoeksamenvatting zag.
4. **Geen garanties.** Kansrijkheid is een inschatting (1–10) met reden. Nooit "viral", "gegarandeerd bereik" of beloftes over resultaten — niet in posts en niet in het dashboard.
5. **Geen auteursrechtelijk beschermd materiaal.** Alleen eigen beelden uit `tools/render.js`. Geen label-muziek; Reels krijgen een stil spoor (eigen voice-over of audio voegt de eigenaar toe).
6. **Privacy.** In de openbare repo komen alleen mediabestanden en tools — geen statistieken, onderbouwingen of klantgegevens. Die horen in het (privé) dashboard.

## Accountwissel 11 november 2026

Tot en met 11 november was dit merk gekoppeld aan `_sjoerdmetadesigns`; daarna aan `metadesigns.1`. Metricool geeft sindsdien alleen nog data van `metadesigns.1`.
- De nulmeting `2026-W45` in `weekly` en de "Eigen data"-trends van 11–12 november gaan over het oude account. Gebruik ze niet als vergelijkingsbasis; bouw een nieuwe basis op uit `metadesigns.1`.
- De concepten voor 12 en 13 november zijn gemaakt vóór de wissel maar staan in hetzelfde merk; bij goedkeuring gaan ze naar `metadesigns.1`. De agent laat ze ongemoeid.

## Huisstijl en doelgroep

- **Doelgroep:** Nederlandse ondernemers (zzp, mkb, lokale dienstverleners: kappers, nagelstudio's, klussers, coaches, horeca, winkels) die (nog) geen professionele website hebben of een verouderde. Extra focus op Zeeland / Zeeuws-Vlaanderen.
- **Aanbod:** professionele websites (5 of 10 pagina's), oplevering binnen één werkweek na aanlevering, betalen na oplevering, vrijblijvend voorbeeld. Daarnaast Meta Ads (Facebook/Instagram-advertenties).
- **Lopende actie:** Novemberdeal t/m 30 november 2026 — 5 pagina's €150 (normaal €250), 10 pagina's €200 (normaal €400). Na 30 november nooit meer noemen; vraag de eigenaar via het dashboard (veld `note`) om een nieuwe actie in plaats van er zelf een te bedenken.
- **Contact:** DM op Instagram, info@metadesigns.nl, www.metadesigns.nl.
- **Toon:** Nederlands, je-vorm, helder, nuchter, behulpzaam, geen jargon (of direct uitgelegd). Korte zinnen. Max. 2–4 emoji per caption, functioneel (👇 💬 📩 🔵). Geen Engelse slogans als hoofdboodschap.
- **Visueel:** donkerblauw `#0A1A33`, MetaDesigns-blauw `#1F5BFF`, lichtblauw `#EAF0FF`, wit. Lettertype Inter Display, vet voor koppen. Woordmerk "metadesigns" + blauwe stip. Accentwoorden in de kop tussen `*sterretjes*`.
- **Captions:** hook in de eerste regel (max. ~90 tekens), dan waarde, dan één duidelijke CTA. 5–10 hashtags: mix van breed (#website #ondernemer #zzp #mkb), niche (#websitelatenmaken #lokaleondernemer) en merk (#metadesigns). Altijd `mediaAltText` invullen.

## Contentmix (vaste formats; de wekelijkse analyse stuurt pijlers, onderwerpen, hooks en tijden)

Per dag precies **twee** posts (vast, door de eigenaar bepaald sinds 12 nov 2026):

1. altijd één **Reel**;
2. één **carrousel óf losse afbeelding**, gekozen op het onderwerp: carrousel voor stappen, lijstjes, uitleg of voorbeelden (bewaarbaar); losse afbeelding voor één sterke boodschap, een cijfer, een vraag of een actie (deelbaar).

De twee posts hebben elk een andere pijler:

| Pijler | Doel | Voorbeelden |
|---|---|---|
| Educatie | bewaren | checklists, fouten, vindbaarheid/AI-zoeken, mobiel, snelheid |
| Proces & bewijs | vertrouwen | werkwijze, voor/na, achter de schermen, "zo bouwen we" |
| Aanbod | conversie | actie, prijs, betalen na oplevering, voorbeeld aanvragen |
| Herkenning | delen/reacties | pijnpunten van ondernemers, mythes vs feiten, vragen |
| Lokaal | relevantie | Zeeuwse ondernemers, "zoek in je eigen plaats" |

Maximaal één post per dag met een harde verkoop-CTA; de andere eindigt met een zachte CTA (bewaren, doorsturen, reageren, DM met vraag).

**Variatie:** lees de laatste 30 dagen in dataset `posts` én de captions van gepubliceerde posts (Metricool IGPO03/IGRE03, laatste 30 dagen). Hergebruik geen hook, kerncijfer, onderwerp-invalshoek of opening van de laatste 14 dagen en geen identieke caption ooit; niet dezelfde pijler op hetzelfde tijdslot twee dagen achter elkaar; wissel voorbeeldberoepen en -plaatsen af.

## Dagelijkse run

**Planning: maximaal 2 Instagram-posts per dag in totaal, inclusief alles wat al in Metricool staat (ook concepten).**
Elke run (06:37) vult de planner aan; er is geen vaste doeldatum meer.

1. Haal de **volledige** planner op: `getScheduledPosts` (brandId 8006283, Europe/Amsterdam) van vandaag t/m vandaag + 30 dagen, en `getBestTimeToPostByNetwork` (instagram, komende 7 dagen). Sla beide antwoorden letterlijk op als JSON-bestanden in je scratchpad.
2. Draai `node tools/plan.js <planner.json> <besttimes.json>` (zonder `--now`: dan geldt de huidige Amsterdamse tijd). Het plan bepaalt:
   - **Wat telt per dag:** **alle** posts die in Metricool op die dag staan, ongeacht de status: automatische publicaties, handmatig ingeplande posts én concepten, van de agent of van de eigenaar. Nooit meer dan 2 per dag in totaal.
   - **Dagen met 2 posts worden overgeslagen.** Andere dagen worden van vroeg naar laat aangevuld (vandaag meegerekend, max. 14 dagen vooruit), **maximaal 2 nieuwe posts per run**.
   - **Format per dag:** 1 Reel + 1 carrousel óf losse afbeelding; staat er al een Reel, dan een carrousel/afbeelding, en omgekeerd.
   - **Tijd:** het beste Metricool-uur van die weekdag (08:00–21:00), minstens 2 uur na de run en minstens 2 uur van elke andere post die dag.
   - **Modus:** automatisch zolang de maandteller < 20, anders concept (maandlimiet).
3. Volg het plan exact (datum, tijd, format, modus). Wijk alleen af als de beveiliging een tijd weigert; kies dan het volgende geldige uur volgens dezelfde regels en meld het.
4. **Nooit dubbel:** maak alleen de posts uit het plan van deze run. Haal vlak vóór elke aanmaak opnieuw `getScheduledPosts` op voor die dag; staan er dan al 2 posts (welke status ook), sla die post over en meld het. Inhoudelijk geen herhaling (zie "Variatie").
5. Bevat het plan niets (alle dagen vol), maak dan niets aan en meld dat.

1. **Voorbereiden.** Voer de accountcontrole (regel 0) uit. Lees dit bestand. Lees in het dashboard de datasets `posts`, `trends`, `weekly`, `times` (via `ArtifactData get` → `source.url` → `Artifact read` met `path` = de 32 tekens na `/_blob/`). Lees het laatste `weekly`-record: de `action`-regels zijn verplichte aanpassingen.
2. **Maandag eerst: weekanalyse** (zie hieronder).
3. **Onderzoek (min. 5 zoekopdrachten, `WebSearch`).** Actuele Instagram-/Reels-trends (deze week), algoritme-updates, contentformats voor dienstverleners/webdesign, Nederlands ondernemersnieuws (mkb, websites, Google/AI-zoeken, KVK, feestdagen/seizoen). Metricool: `getAnalyticsDataByMetrics` voor eigen posts (IGPO*) en Reels (IGRE*) van de laatste 30 dagen, **Concurrentieonderzoek (dagelijks, verplicht):** haal concurrenten op via Metricool (IGCO*, IGCP*, IGCR*); staan er (nog) geen in Metricool, zoek dan met `WebSearch` naar Nederlandse webdesigners/websitebouwers voor ondernemers (o.a. Zeeland, Brabant, landelijke budgetaanbieders) en hun aanbod, acties en contentthema's. Neem minstens één trend van type `Concurrent` op en vermeld als er geen concurrentiedata beschikbaar was. Noteer 4–8 trends met bewijs + bron.
4. **Planning en publicatietijden.** Volg "Planning" hierboven: `tools/plan.js` bepaalt welke dagen, tijden en formats worden aangevuld. Noteer de beste tijden ook in de dataset `times`.
5. **Ideeën → de posts uit het plan.** Bedenk per te maken post minstens twee ideeën en kies het sterkste (bij "carrousel of afbeelding": onderbouw de keuze). Schrijf per post: format, pijler, hook, caption, hashtags, CTA, visuele specificatie, kansrijkheid (1–10) + waarom (verwijs naar trends en eigen data), bronnen.
6. **Beelden maken.** Schrijf per post een spec (zie `tools/voorbeeld-*.json`): `kind` = `image` (1 slide), `carousel` (5–8 slides, laatste = `cta`) of `reel` (4–6 scènes, 10–20 s totaal, eerste scène is de hook). Draai `node tools/render.js spec.json out/`. Bekijk het resultaat (montage/screenshot) en los afgekapte of te volle tekst op.
7. **Uploaden.** Kopieer naar `media/JJJJ/MM/DD/`, commit ("Media JJJJ-MM-DD"), `git push origin main`. Gebruik URL's vastgepind op de commit: `https://raw.githubusercontent.com/metadesigns-web/metadesigns-content/<commit-sha>/media/...`. Video's > 50 MB: niet pushen; meld het in het dashboard.
8. **Naar Metricool.** Elke post als automatische publicatie (zie "Automatisch publiceren"), na de controle hieronder; alleen bij maandlimiet of technische weigering als concept, met melding. `createScheduledPost` per post: concept = `draft: true`, `autoPublish: false`; automatische publicatie = `draft: false`, `autoPublish: true`; `providers: [{"network":"instagram"}]` (= `metadesigns.1`), `instagramData.type` = `POST` (afbeelding/carrousel) of `REEL` (+ `videoThumbnailUrl` = cover), `mediaAltText` per afbeelding, `publicationDate` in Europe/Amsterdam. Controleer na **elke** aanmaak in het antwoord én via `getScheduledPosts` dat Instagram-status `PENDING` is en `autoPublish: true`, `draft: false`, `instagramData.autoPublish: true` (bij automatisch); controleer dat geen dag meer dan 2 meetellende posts heeft; commit/push de ledger. Faalt een post: één keer corrigeren, anders als `status: "mislukt"` met de fout in het dashboard.
9. **Dashboard bijwerken** (zie "Dashboard"). Daarna een korte samenvatting als eindbericht: het plan (welke dagen aangevuld, welke vol), de nieuwe posts met datum, tijd en status (automatisch ingepland/Pending of concept + reden), links naar de Metricool-planner, de maandteller (x/20), en eventuele problemen.

## Automatisch publiceren — ALLE nieuwe posts (maximaal 20 per kalendermaand)

**Elke nieuwe post die de agent aanmaakt (Reel, carrousel én losse afbeelding) wordt echt ingepland als automatische publicatie**, met exact deze Metricool-instellingen in `createScheduledPost`:

```json
"blogId": "8006283",
"date": "<JJJJ-MM-DDTHH:MM:SS+01:00 of +02:00>",
"info": { "autoPublish": true, "draft": false,
          "providers": [{"network": "instagram"}],
          "publicationDate": {"dateTime": "<JJJJ-MM-DDTHH:MM:SS>", "timezone": "Europe/Amsterdam"},
          "instagramData": {"type": "REEL" | "POST", "autoPublish": true, ...} }
```

- `autoPublish: true` = Metricool publiceert zelf via de API op het geplande tijdstip. (`autoPublish: false` = alleen een pushmelding om handmatig te publiceren: **verboden**, de hook blokkeert dit.)
- `draft: false` = echt ingepland, geen concept.
- `instagramData.autoPublish: true` expliciet meesturen.
- Instagram-account `metadesigns.1` via merk MetaDesigns 8006283 (accountcontrole met `getBrandSettings` < 6 uur oud, hook-verplicht).
- Na aanmaak moet Metricool tonen: `autoPublish: true`, `draft: false`, `instagramData.autoPublish: true`, `providers[0].network: "instagram"` met `status: "PENDING"` (`detailedStatus: "Pending"`).

Maak content daarom altijd publicatieklaar: alleen geverifieerde cijfers met bron, geen acties die vóór of op de publicatiedag aflopen, geen gevoelige onderwerpen. Twee automatische publicaties liggen minstens 2 uur uit elkaar (hook-verplicht).

**Teller (ledger).** `.claude/state/autopublish-ledger.json` in deze repo houdt in `drafts` de concepten van de agent bij (administratie) en telt in `months` álle automatische publicaties per kalendermaand: die van de agent (via de record-hook bij aanmaak) én die in Metricool op een andere manier op automatisch staan (bijv. door de eigenaar omgezet; de record-hook voegt ze toe als `source: "extern"` zodra `getScheduledPosts` ze toont). Een toekomstige automatische publicatie die niet meer in de planner staat (verwijderd of teruggezet), markeert de record-hook als `cancelled`; die telt niet meer mee. Gepubliceerde posts blijven meetellen. Roep daarom aan het begin van elke run `getScheduledPosts` aan voor de hele lopende en volgende maand. Commit en push de ledger **direct** na elke wijziging (`git add .claude/state/ && git commit && git push`). Pas de ledger nooit met de hand aan, behalve om hem na een containerwissel te herstellen uit git.

**Wanneer automatisch publiceren niet kan** (de enige gevallen):
1. *Maandlimiet bereikt:* de ledger telt 20 actieve automatische publicaties in de maand van de publicatiedatum. De hook weigert dan de 21e.
2. *Technisch geweigerd:* de hook of Metricool weigert de aanmaak, of het antwoord/`getScheduledPosts` bevestigt `autoPublish: true` + `PENDING` niet (dan staat er een regel in `.claude/state/autopublish-warnings.json`).

In die gevallen: **niet** stilzwijgend handmatig inplannen. Maak de post aan als concept (`draft: true`, `autoPublish: false`) zodat het werk niet verloren gaat, zet `status: "concept"` en `publish_note` met de exacte reden in de dataset `posts`, en meld het bovenaan je samenvatting. Is een post al aangemaakt maar bevestigt Metricool automatisch publiceren niet: zet hem terug naar concept (regel 2) en meld het.

**Gevolg van de limiet:** met 2 posts per dag is de limiet van 20 meestal rond dag 10 van de maand bereikt; daarna maakt de planner concepten (die hun dag bezet houden, dus geen dubbele posts) tot de 1e van de volgende maand. Meld in elke samenvatting de stand (x/20) en vanaf 16/20 expliciet hoeveel er nog over zijn.

**Vóór iedere aanmaak controleren dat automatisch publiceren echt is ingeschakeld:** lees de JSON die je gaat versturen terug en bevestig `autoPublish: true`, `draft: false`, `instagramData.autoPublish: true`, `blogId` 8006283 en alleen provider `instagram`. **Na** de aanmaak: het antwoord van Metricool moet `autoPublish: true`, `draft: false` en `instagramData.autoPublish: true` tonen; daarna nog eens via `getScheduledPosts`. Wijkt iets af: terug naar concept (regel 2) en melden. De record-hook schrijft afwijkingen ook naar `.claude/state/autopublish-warnings.json`; lees dat bestand aan het eind van de run en meld wat erin staat.

**Controle vóór elke automatische publicatie** (alles moet kloppen; de hook controleert een deel ook technisch):
- *Account:* `getBrandSettings` in deze run gedaan (hook eist < 6 uur): merk MetaDesigns 8006283 ↔ Instagram metadesigns.1; `providers` alleen `instagram`.
- *Media:* bestanden lokaal bekeken (montage/screenshot); juiste aantal (Reel: 1 .mp4 + cover; carrousel 2–10, afbeelding 1); URL's vastgepind op een commit die op `origin/main` staat, in de map van de publicatiedatum.
- *Caption:* spelling en toon gecontroleerd, geen placeholders, ≤ 2200 tekens, ≤ 30 hashtags, CTA klopt, prijzen/acties nog geldig op de publicatiedatum.
- *Datum en tijd:* `publicationDate.timezone` = Europe/Amsterdam, `date` met dezelfde tijd en de juiste UTC-offset (+01:00 winter, +02:00 zomer), minstens 2 uur in de toekomst.
- *Na het aanmaken:* `getScheduledPosts` → de post staat er met `autoPublish: true`, `draft: false`, de juiste tijd en media op static.metricool.com. Klopt iets niet: direct terugzetten naar concept (regel 2) en melden.

## Weekanalyse (elke maandag, vóór de dagelijkse stappen)

1. Gebruik alleen data van `metadesigns.1` (vanaf 11 november 2026). Haal via Metricool de posts (IGPO01,03,06,07,14,28,12,15,27,08) en Reels (IGRE01,03,06,23,11,09,12,21,07,24) van de afgelopen 7 én 28 dagen op, plus accountgroei (IGEV01, IGEV43).
2. Koppel gepubliceerde posts aan `posts` (eerste 60 tekens van de caption). Bepaal per format, pijler, hooktype en tijdslot: bereik, weergaven, interacties, bewaard, gedeeld, en ratio's per bereik.
3. Schrijf een `weekly`-record: wat werkte, wat niet, en 2–4 concrete `action`-regels voor de komende week (bijv. "Reels op 12:00 i.p.v. 19:00", "meer lokale hooks"). Wees eerlijk over kleine aantallen: onder ~200 bereik per week zijn verschillen indicatief, niet significant.
4. Pas de kansrijkheidsscores van komende posts aan op wat aantoonbaar werkte. Werk de mixtabel niet in dit bestand bij; zet de aanbeveling in `weekly.action`.

## Dashboard

Het dashboard (Artifact-type "Data") leest bestanden die de agent per run vervangt. Werkwijze per dataset:
`ArtifactData get` (`collection: "datasets"`, `doc_id`) → huidige `source.url` en `version` → oud bestand downloaden → nieuwe rijen toevoegen (oudste weggooien na 120 dagen) → lokaal JSON-bestand (array van objecten) → `Artifact` publish met `url` = dashboard, `asset: true`, `file_path` → `ArtifactData update` met `if_version`: `source.url` = nieuwe `/_blob/<id>`, `updated: {at, by: "MetaDesigns Agent"}`, `edit: {via: "claude", at}` → oud bestand verwijderen (`Artifact` delete met `path` = oude asset-id). Schrijf niets anders in de store dan deze datasets; de pagina zelf (`files/index.html`) verandert de agent niet.

| Dataset | Kolommen |
|---|---|
| `posts` | `id` (JJJJ-MM-DD-a/b, datum = publicatiedatum; tot 13 nov ook -c), `run_date` (echte datum van de run), `publish_date` (het dashboard groepeert hierop), `time` (HH:MM), `format` (Carrousel/Reel/Afbeelding), `pillar`, `hook`, `caption`, `hashtags`, `cta`, `visual`, `slides` (aantal), `chance` (1–10), `why`, `sources` (regels "titel — url"), `media` (URL's gescheiden door spatie), `planner_url`, `uuid`, `status` (automatisch ingepland/concept/mislukt/gepubliceerd/afgewezen), `publish_note` (waarom concept in plaats van automatisch, of leeg) |
| `trends` | `run_date`, `for_date` (= publicatiedatum van de posts waarvoor dit onderzoek gold), `trend`, `type` (Format/Onderwerp/Hook/Algoritme/Seizoen/Eigen data/Concurrent), `evidence`, `source_title`, `source_url`, `used_in` (post-id's of leeg) |
| `times` | `run_date`, `for_date` (idem), `date`, `weekday`, `slot1`, `slot2`, `slot3`, `score` (hoogste Metricool-waarde), `note` |
| `weekly` | `week` (JJJJ-Www), `period`, `posts`, `reach`, `views`, `interactions`, `saves`, `shares`, `followers`, `best_post`, `best_url`, `worked`, `didnt`, `action` |

`ig_posts` en `ig_reels` zijn live Metricool-queries; die hoeft de agent niet bij te werken (einddatum staat op 31-12-2027).
