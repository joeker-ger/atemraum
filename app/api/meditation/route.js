import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 60;

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function systemPrompt(mode) {
  const address = mode === "group" ? "ihr/euch/wir" : "du/dein/ich";
  return `Du verfasst eine kurze christliche Meditation für Atemraum, ein Testangebot für Menschen, die in einer diakonischen Organisation leben und arbeiten.

Haltung:
- freiwillig, würdevoll, nicht urteilend, zweckfrei und ohne Ergebnisdruck
- christlich erkennbar, aber verständlich für Menschen mit unterschiedlicher religiöser Sozialisation
- kein Coaching, keine Diagnose, keine Therapie, keine Leistungsoptimierung
- keine Behauptung, Gott habe eine konkrete Botschaft oder Lösung für die Person
- keine Wiederholung oder wörtliche Wiedergabe der Eingabe
- keine Namen, Diagnosen oder sensiblen Details aus der Eingabe nennen

Aufgabe:
- Nach jeder Reflexionsfrage einen eigenen Absatz erzeugen.
- Nur kurze Absätze verwenden.
- Jeder wichtige Gedanke bekommt einen eigenen Absatz.
- Deute die beschriebene Situation behutsam und konkret.
- Formuliere 2 bis 4 offene Reflexionsfragen.
- Verbinde die Situation mit Gottes Gegenwart, ohne zu predigen.
- Lade zu einer stillen Zeit ein.
- Schließe mit einem kurzen Gebet und Amen.
- Anrede konsequent: ${address}.
- Ausgabe nur als sprechfertiger Meditationstext, ohne Überschrift, Regieanweisungen, Klammern oder Aufzählungen.
- Kurze Absätze und kurze Sätze sorgen für natürliche Sprechpausen.
- Zielumfang: etwa 280 bis 380 deutsche Wörter.`;
}

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: "Auf dem Server fehlt OPENAI_API_KEY." }, { status: 500 });
    }

    const body = await request.json();
    const concern = String(body.concern || "").trim().slice(0, 700);
    const mode = body.mode === "group" ? "group" : "single";

    if (concern.length < 5) {
      return Response.json({ error: "Bitte beschreiben Sie die Situation etwas genauer." }, { status: 400 });
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      instructions: systemPrompt(mode),
      input: concern
    });

    const meditation = response.output_text?.trim();
    if (!meditation) throw new Error("Das Sprachmodell hat keinen Text geliefert.");

    const speech = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "marin",
      input: meditation,
      instructions: `
Sprich auf Deutsch.

Sehr langsam.
Sehr ruhig.
Warm und menschlich.

Nach jedem Absatz eine deutliche Pause.

Nach jeder Reflexionsfrage mindestens drei Sekunden Stille.

Lass Gedanken nachklingen.

Sprich wie eine erfahrene geistliche Begleiterin.

Nicht belehrend.
Nicht werblich.
Nicht coachend.

Nutze lange Atempausen.

Zwischen wichtigen Gedanken bewusst Stille zulassen.

Das Gebet besonders ruhig sprechen.

Den letzten Satz langsam ausklingen lassen.
`
      response_format: "mp3"
    });

    const audio = await speech.arrayBuffer();
    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "private, no-store",
        "X-AI-Voice": "true"
      }
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Die Meditation konnte nicht erzeugt werden. Prüfen Sie API-Schlüssel, Guthaben und Vercel-Logs." }, { status: 500 });
  }
}
