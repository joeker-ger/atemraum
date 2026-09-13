"use client";

import { useEffect, useRef, useState } from "react";

const examples = {
  single: "Ich bin aufgeregt, weil das Wochenende vor der Tür steht.",
  group: "Wir sind in der Team-Übergabe, haben wenig Zeit und viele schwierige Situationen im Kopf."
};

export default function Home() {
  const [mode, setMode] = useState("single");
  const [concern, setConcern] = useState(examples.single);
  const [status, setStatus] = useState("Bereit");
  const [meditating, setMeditating] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);
  const ambienceRef = useRef(null);

  useEffect(() => () => stopAll(), []);

  function changeMode(next) {
    setMode(next);
    setConcern(examples[next]);
  }

  function startAmbience() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.055;
    master.connect(ctx.destination);

    const tones = [98, 146.83, 196];
    const oscillators = tones.map((frequency, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const depth = ctx.createGain();
      osc.type = i === 1 ? "triangle" : "sine";
      osc.frequency.value = frequency;
      gain.gain.value = 0.08 / (i + 1);
      lfo.frequency.value = 0.025 + i * 0.012;
      depth.gain.value = gain.gain.value * 0.65;
      lfo.connect(depth).connect(gain.gain);
      osc.connect(gain).connect(master);
      osc.start();
      lfo.start();
      return { osc, lfo };
    });

    ambienceRef.current = {
      ctx,
      master,
      stop: () => {
        oscillators.forEach(({ osc, lfo }) => { try { osc.stop(); lfo.stop(); } catch {} });
        ctx.close();
      }
    };
  }

  function stopAll() {
    if (audioRef.current) {
      audioRef.current.pause();
      if (audioRef.current.src?.startsWith("blob:")) URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
    ambienceRef.current?.stop();
    ambienceRef.current = null;
    setMeditating(false);
  }

  function toggleSound() {
    const next = !muted;
    setMuted(next);
    if (audioRef.current) audioRef.current.muted = next;
    if (ambienceRef.current) {
      ambienceRef.current.master.gain.setTargetAtTime(next ? 0 : 0.055, ambienceRef.current.ctx.currentTime, 0.5);
    }
  }

  async function startMeditation() {
    if (concern.trim().length < 5) {
      setStatus("Bitte beschreiben Sie Ihre Situation etwas genauer.");
      return;
    }

    stopAll();
    setMeditating(true);
    setStatus("Die persönliche Meditation wird vorbereitet …");
    startAmbience();

    try {
      const response = await fetch("/api/meditation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concern, mode })
      });

      if (!response.ok) {
        const problem = await response.json().catch(() => ({}));
        throw new Error(problem.error || "Die Meditation konnte nicht erzeugt werden.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.muted = muted;
      audio.onplay = () => setStatus("Nehmen Sie sich Zeit. Die Stimme ist KI-generiert.");
      audio.onended = () => {
        setStatus("Die Meditation ist beendet.");
        ambienceRef.current?.stop();
        ambienceRef.current = null;
        URL.revokeObjectURL(url);
        setMeditating(false);
      };
      audio.onerror = () => setStatus("Das Audio konnte nicht abgespielt werden.");
      await audio.play();
    } catch (error) {
      stopAll();
      setStatus(error.message || "Es ist ein Fehler aufgetreten.");
    }
  }

  return (
    <main className="shell">
      <section className="card">
        <div className="brand">ATEMRAUM · TESTVERSION v0.1</div>
        <h1>In Gottes Gegenwart<br />zur Ruhe kommen</h1>
        <p className="intro">Ein persönlicher Moment für Menschen, die im Diakoniewerk leben und arbeiten.</p>

        {!meditating ? (
          <>
            <div className="switch" aria-label="Meditationsform wählen">
              <button className={mode === "single" ? "active" : ""} onClick={() => changeMode("single")}>Für mich</button>
              <button className={mode === "group" ? "active" : ""} onClick={() => changeMode("group")}>Für uns als Gruppe</button>
            </div>

            <label htmlFor="concern">Was ist gerade da?</label>
            <textarea
              id="concern"
              value={concern}
              onChange={(event) => setConcern(event.target.value)}
              maxLength={700}
              rows={6}
              placeholder="Beschreiben Sie kurz, was Sie bewegt …"
            />
            <p className="privacy">Bitte keine Namen, Diagnosen oder personenbezogenen Daten eingeben. Der Text wird zur Erzeugung der Meditation an einen externen KI-Dienst übermittelt und in dieser Testversion nicht bewusst gespeichert.</p>
            <button className="primary" onClick={startMeditation}>Meditation erzeugen und starten</button>
          </>
        ) : (
          <div className="meditation">
            <div className="blob" aria-hidden="true"><span></span><span></span><span></span></div>
            <p className="status">{status}</p>
            <div className="controls">
              <button onClick={toggleSound}>{muted ? "Ton einschalten" : "Ton ausschalten"}</button>
              <button onClick={stopAll}>Beenden</button>
            </div>
          </div>
        )}

        {!meditating && <p className="status setup-status">{status}</p>}
        <footer>KI-generierte Stimme · Testangebot, keine medizinische oder psychotherapeutische Beratung</footer>
      </section>
    </main>
  );
}
