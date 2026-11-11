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
1. **Alleen concepten of toegestane automatische publicaties.** Elke post is óf een concept (`"draft": true`, `"autoPublish": false`) óf een automatische publicatie volgens de sectie "Automatisch publiceren" (`"draft": false`, `"autoPublish": true`). Nooit iets direct publiceren, nooit `createScheduledPostForReview` of `sendScheduledPostForReview`. De hooks in `.claude/settings.json` blokkeren alles wat hier niet aan voldoet (zie `.claude/hooks/metricool-guard.js`).
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

Doeldatum = **de eerstvolgende beschikbare publicatiedag**: de eerste dag vanaf morgen (Europe/Amsterdam) met minder dan twee agent-posts (dataset `posts` én Metricool via `getScheduledPosts`). Elke run maakt voor precies één dag precies twee contentstukken (1 Reel + 1 carrousel of afbeelding); staat er voor die dag al één agent-post, maak dan alleen het ontbrekende format. Uitzondering voor de overgang: op za 14 nov staat al de afbeelding (testpost, automatisch ingepland), dus de run van 12 nov maakt alleen de Reel voor die dag. Posts van de eigenaar op die dag maken de dag niet bezet; plan er alleen omheen.

1. **Voorbereiden.** Voer de accountcontrole (regel 0) uit. Lees dit bestand. Lees in het dashboard de datasets `posts`, `trends`, `weekly`, `times` (via `ArtifactData get` → `source.url` → `Artifact read` met `path` = de 32 tekens na `/_blob/`). Lees het laatste `weekly`-record: de `action`-regels zijn verplichte aanpassingen.
2. **Maandag eerst: weekanalyse** (zie hieronder).
3. **Onderzoek (min. 5 zoekopdrachten, `WebSearch`).** Actuele Instagram-/Reels-trends (deze week), algoritme-updates, contentformats voor dienstverleners/webdesign, Nederlands ondernemersnieuws (mkb, websites, Google/AI-zoeken, KVK, feestdagen/seizoen). Metricool: `getAnalyticsDataByMetrics` voor eigen posts (IGPO*) en Reels (IGRE*) van de laatste 30 dagen, **Concurrentieonderzoek (dagelijks, verplicht):** haal concurrenten op via Metricool (IGCO*, IGCP*, IGCR*); staan er (nog) geen in Metricool, zoek dan met `WebSearch` naar Nederlandse webdesigners/websitebouwers voor ondernemers (o.a. Zeeland, Brabant, landelijke budgetaanbieders) en hun aanbod, acties en contentthema's. Neem minstens één trend van type `Concurrent` op en vermeld als er geen concurrentiedata beschikbaar was. Noteer 4–8 trends met bewijs + bron.
4. **Publicatietijden.** `getBestTimeToPostByNetwork` (instagram, komende 7 dagen). Kies voor de doeldatum twee tijdslots met de hoogste waarden, minstens 2 uur uit elkaar, en niet binnen 60 min van een bestaande post (`getScheduledPosts`). Combineer met eigen resultaten per uur uit `weekly` zodra er genoeg data is (≥ 20 posts).
5. **Ideeën → twee posts.** Bedenk eerst minstens vier ideeën en kies de twee sterkste (onderbouw de keuze voor carrousel of afbeelding). Schrijf per post: format, pijler, hook, caption, hashtags, CTA, visuele specificatie, kansrijkheid (1–10) + waarom (verwijs naar trends en eigen data), bronnen.
6. **Beelden maken.** Schrijf per post een spec (zie `tools/voorbeeld-*.json`): `kind` = `image` (1 slide), `carousel` (5–8 slides, laatste = `cta`) of `reel` (4–6 scènes, 10–20 s totaal, eerste scène is de hook). Draai `node tools/render.js spec.json out/`. Bekijk het resultaat (montage/screenshot) en los afgekapte of te volle tekst op.
7. **Uploaden.** Kopieer naar `media/JJJJ/MM/DD/`, commit ("Media JJJJ-MM-DD"), `git push origin main`. Gebruik URL's vastgepind op de commit: `https://raw.githubusercontent.com/metadesigns-web/metadesigns-content/<commit-sha>/media/...`. Video's > 50 MB: niet pushen; meld het in het dashboard.
8. **Naar Metricool.** Bepaal eerst volgens "Automatisch publiceren" of één van de twee posts automatisch gepubliceerd wordt (en voer dan de controle uit). `createScheduledPost` per post: concept = `draft: true`, `autoPublish: false`; automatische publicatie = `draft: false`, `autoPublish: true`; `providers: [{"network":"instagram"}]` (= `metadesigns.1`), `instagramData.type` = `POST` (afbeelding/carrousel) of `REEL` (+ `videoThumbnailUrl` = cover), `mediaAltText` per afbeelding, `publicationDate` in Europe/Amsterdam. Controleer met `getScheduledPosts` dat er voor de doeldatum precies twee agent-posts staan, met de bedoelde status (concept of automatisch), en commit/push de ledger als er automatisch is ingepland. Faalt een post: één keer corrigeren, anders als `status: "mislukt"` met de fout in het dashboard.
9. **Dashboard bijwerken** (zie "Dashboard"). Daarna een korte samenvatting als eindbericht: doeldatum, de twee posts met tijd en status (concept of automatisch ingepland), links naar de Metricool-planner, de maandteller (x/20), en eventuele problemen.

## Automatisch publiceren (maximaal 20 per kalendermaand)

Het gratis Metricool-abonnement staat maximaal 20 automatische publicaties per maand toe. De agent plant er hoogstens 1 per dag en verdeelt ze over de maand. De rest blijft concept.

**Teller (ledger).** `.claude/state/autopublish-ledger.json` in deze repo. De PostToolUse-hook voegt elke geslaagde automatische publicatie toe; de PreToolUse-hook weigert de 21e van een maand en een tweede op dezelfde dag. Commit en push de ledger **direct** na elke automatische publicatie (`git add .claude/state/autopublish-ledger.json && git commit && git push`), zodat een nieuwe container dezelfde telling heeft. Pas de ledger nooit met de hand aan, behalve om hem na een containerwissel te herstellen uit git.

**Wanneer automatisch publiceren (per doeldatum):**
1. `gebruikt` = actieve (niet-geannuleerde) ledger-items in de maand van de doeldatum; `tempo` = afgerond(20 × dag-van-de-maand ÷ dagen-in-de-maand).
2. Publiceer automatisch als `gebruikt` < 20 én `gebruikt` < `tempo`. Op zaterdag en zondag alleen als `gebruikt` < `tempo` − 1 (weekend heeft ongeveer de helft van de activiteit).
3. Kies dan **één** van de twee posts: de hoogste kansrijkheid (minimaal 6/10); bij gelijke score de Reel. Plaats hem op het **beste** tijdslot van die dag volgens `getBestTimeToPostByNetwork` (tussen 08:00 en 21:59). De andere post wordt concept.
4. Geen automatische publicatie bij: een cijfer of bron die je niet volledig kon verifiëren, een tijdgebonden actie die vóór of op de publicatiedag afloopt, een onderwerp dat gevoelig ligt, of als iets in de controle hieronder twijfel geeft. Dan beide als concept.

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
| `posts` | `id` (JJJJ-MM-DD-a/b, datum = publicatiedatum; tot 13 nov ook -c), `run_date` (echte datum van de run), `publish_date` (het dashboard groepeert hierop), `time` (HH:MM), `format` (Carrousel/Reel/Afbeelding), `pillar`, `hook`, `caption`, `hashtags`, `cta`, `visual`, `slides` (aantal), `chance` (1–10), `why`, `sources` (regels "titel — url"), `media` (URL's gescheiden door spatie), `planner_url`, `uuid`, `status` (concept/automatisch ingepland/mislukt/gepubliceerd/afgewezen) |
| `trends` | `run_date`, `for_date` (= publicatiedatum van de posts waarvoor dit onderzoek gold), `trend`, `type` (Format/Onderwerp/Hook/Algoritme/Seizoen/Eigen data/Concurrent), `evidence`, `source_title`, `source_url`, `used_in` (post-id's of leeg) |
| `times` | `run_date`, `for_date` (idem), `date`, `weekday`, `slot1`, `slot2`, `slot3`, `score` (hoogste Metricool-waarde), `note` |
| `weekly` | `week` (JJJJ-Www), `period`, `posts`, `reach`, `views`, `interactions`, `saves`, `shares`, `followers`, `best_post`, `best_url`, `worked`, `didnt`, `action` |

`ig_posts` en `ig_reels` zijn live Metricool-queries; die hoeft de agent niet bij te werken (einddatum staat op 31-12-2027).
