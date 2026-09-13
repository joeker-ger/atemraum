# Atemraum Testpaket v0.1

Ein bewusst kleiner Machbarkeitstest: Anliegen eingeben, KI formuliert eine christliche Meditation, hochwertige KI-Stimme spricht sie, sphärischer Klang und wabernde Blase begleiten die Wiedergabe.

## Wichtig vor dem Test

- Dies ist kein freigegebenes Produktivangebot.
- Keine Namen, Diagnosen oder personenbezogenen Daten eingeben.
- Eingaben werden an OpenAI übermittelt.
- Der OpenAI-Schlüssel gehört ausschließlich in Vercel, niemals in GitHub.
- Die Oberfläche weist aus, dass die Stimme KI-generiert ist.

## A. Dateien über die GitHub-Webseite hochladen

1. Dieses ZIP auf dem Rechner entpacken.
2. In GitHub das Repository `atemraum` öffnen.
3. Falls dort nur eine README liegt: `Add file` anklicken.
4. `Upload files` anklicken.
5. Im Windows-Explorer den entpackten Ordner `atemraum` öffnen.
6. Alle sichtbaren Dateien und Ordner markieren: `app`, `.env.example`, `.gitignore`, `next.config.mjs`, `package.json`, `README.md`.
7. Die markierten Elemente auf die GitHub-Fläche `Drag files here` ziehen.
8. Unten in `Commit changes` als Nachricht `Atemraum v0.1` eintragen.
9. Den grünen Knopf `Commit changes` anklicken.

Hinweis: Falls Windows Dateien mit führendem Punkt nicht bequem auswählen lässt, sind `.gitignore` und `.env.example` für den Online-Test nicht zwingend. Der geheime Schlüssel darf trotzdem niemals als Datei hochgeladen werden.

## B. In Vercel veröffentlichen

1. Vercel öffnen und `Add New...` anklicken.
2. `Project` anklicken.
3. Neben dem GitHub-Repository `atemraum` auf `Import` klicken.
4. Vercel sollte bei `Framework Preset` automatisch `Next.js` anzeigen.
5. Den Bereich `Environment Variables` aufklappen.
6. Als Name exakt `OPENAI_API_KEY` eintragen.
7. Als Value den OpenAI API-Schlüssel einfügen.
8. `Add` anklicken.
9. `Deploy` anklicken.
10. Nach erfolgreichem Build `Continue to Dashboard` oder `Visit` anklicken.

## C. OpenAI-Voraussetzungen

Ein ChatGPT-Abonnement ist nicht automatisch dasselbe wie API-Guthaben. Im OpenAI-API-Konto müssen Abrechnung beziehungsweise Guthaben für API-Aufrufe eingerichtet sein.

## D. Testen

1. Zunächst die voreingestellte Beispieleingabe stehen lassen.
2. `Meditation erzeugen und starten` anklicken.
3. Die Erzeugung kann einen Moment dauern.
4. Danach startet die KI-Stimme automatisch.
5. Falls der Browser Autoplay blockiert, das Wiedergabesymbol des Browsers zulassen und erneut testen.

## E. Link an Kolleginnen und Kollegen

Öffnen Sie in Vercel das Projekt. Unter `Domains` oder auf der Deployment-Seite steht die Adresse, typischerweise nach dem Muster `projektname.vercel.app`. Diesen Link können Sie versenden.

## F. Häufige Fehler

### `Auf dem Server fehlt OPENAI_API_KEY`
In Vercel: Project > Settings > Environment Variables. Variable ergänzen und danach unter Deployments ein neues Deployment auslösen.

### `Die Meditation konnte nicht erzeugt werden`
Prüfen:
- Ist der API-Schlüssel korrekt?
- Ist API-Abrechnung oder Guthaben eingerichtet?
- Vercel > Project > Logs öffnen und den neuesten Fehler ansehen.

### GitHub zeigt falsche Ordnerstruktur
Im Repository muss direkt `package.json` sichtbar sein. Es darf nicht erst `atemraum/atemraum/package.json` sein.

## G. Bewusste Grenzen von v0.1

- Dauer ist noch nicht wählbar.
- Keine Anmeldung und keine Zugriffsbeschränkung.
- Keine Datenbank.
- Keine fachlich ausgearbeitete Krisenerkennung.
- Prompt-Framework ist nur ein erster Haltungsrahmen.
- Sphärischer Klang wird synthetisch im Browser erzeugt.

Vor einem breiteren oder produktiven Einsatz sind Datenschutz, Informationssicherheit, Kostenbegrenzung, Missbrauchsschutz, Barrierefreiheit und fachliche Qualitätssicherung zu klären.
