"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STRETCH_BANK, type Stretch } from "@/lib/stretches";

const QUICK_PROMPTS = [
  "I sit at a desk all day and have tight hip flexors",
  "I just did a heavy leg day, please avoid direct spinal loading",
  "Morning wake-up, I want to feel loose in 10 minutes",
  "Runner's cooldown, my calves and hamstrings are tight",
  "Upper back tension from working on a laptop",
];

function getById(id: string) {
  return STRETCH_BANK.find((s) => s.id === id);
}

function fallbackRoutine(prompt: string): Stretch[] {
  const p = prompt.toLowerCase();
  const avoidSpine = p.includes("avoid") && p.includes("spinal");
  let ids: string[] = [];
  if (p.includes("desk") || p.includes("hip flexor") || p.includes("sit")) {
    ids = ["hip-flexor-lunge", "doorway-chest", "thoracic-rotation", "neck-release", "pigeon", "childs-pose"];
  } else if (p.includes("leg") || p.includes("quad") || p.includes("hamstring")) {
    ids = ["standing-hamstring", "standing-quad", "hip-flexor-lunge", "calf-wall", "90-90-switch", "pigeon"];
  } else if (p.includes("runner") || p.includes("calf")) {
    ids = ["calf-wall", "standing-hamstring", "standing-quad", "hip-flexor-lunge", "pigeon", "childs-pose"];
  } else if (p.includes("morning") || p.includes("wake")) {
    ids = ["cat-cow", "worlds-greatest", "down-dog-cobra", "thoracic-rotation", "deep-squat", "childs-pose"];
  } else if (p.includes("back") || p.includes("upper")) {
    ids = ["doorway-chest", "thoracic-rotation", "thread-needle", "neck-release", "childs-pose", "cat-cow"];
  } else {
    ids = ["cat-cow", "hip-flexor-lunge", "doorway-chest", "standing-hamstring", "pigeon", "childs-pose"];
  }
  if (avoidSpine) {
    ids = ids.filter((id) => !["cat-cow", "down-dog-cobra", "childs-pose"].includes(id));
    ids.push("standing-hamstring", "calf-wall");
  }
  return ids.slice(0, 6).map(getById).filter(Boolean) as Stretch[];
}

function playBeep() {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = 0.15;
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {}
}

export default function Home() {
  const [userPrompt, setUserPrompt] = useState(QUICK_PROMPTS[0]);
  const [routine, setRoutine] = useState<Stretch[]>([]);
  const [reasoning, setReasoning] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [repsDone, setRepsDone] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restLeft, setRestLeft] = useState(5);
  const [isComplete, setIsComplete] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterDiff, setFilterDiff] = useState("All");

  const current = routine[currentIndex];
  const totalTime = routine.reduce((sum, s) => sum + (s.unit === "seconds" ? s.duration : s.duration * 3), 0);

  useEffect(() => {
    if (!current) return;
    setTimeLeft(current.unit === "seconds" ? current.duration : 0);
    setRepsDone(0);
    setIsRunning(false);
  }, [currentIndex, routine.length]);

  useEffect(() => {
    if (!isRunning || !current || isResting || isComplete) return;
    if (current.unit !== "seconds") return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 4 && t > 1 && soundOn) playBeep();
        if (t <= 1) {
          clearInterval(id);
          finishStretch();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, currentIndex, isResting, soundOn]);

  useEffect(() => {
    if (!isResting) return;
    const id = setInterval(() => {
      setRestLeft((r) => {
        if (r <= 1) {
          clearInterval(id);
          setIsResting(false);
          if (currentIndex < routine.length - 1) {
            setCurrentIndex((i) => i + 1);
            setIsRunning(true);
          }
          return 5;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isResting]);

  function finishStretch() {
    setIsRunning(false);
    if (currentIndex >= routine.length - 1) {
      setIsComplete(true);
    } else {
      setIsResting(true);
      setRestLeft(5);
    }
  }

  function handleRepComplete() {
    if (!current) return;
    const next = repsDone + 1;
    setRepsDone(next);
    if (next >= current.duration) finishStretch();
  }

  async function handleGenerate() {
    if (!userPrompt.trim()) return;
    setIsGenerating(true);
    setError("");
    setIsComplete(false);
    setCurrentIndex(0);
    setIsResting(false);
    try {
      const res = await fetch("/api/generate-routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      if (data.routine && data.routine.length > 0) {
        setRoutine(data.routine);
        setReasoning(data.reasoning || "Routine generated by Gemini from your local stretch bank.");
      } else {
        throw new Error("Empty");
      }
    } catch {
      const fb = fallbackRoutine(userPrompt);
      setRoutine(fb);
      setReasoning("Gemini was unavailable, so I used local logic to build this routine from your stretch bank. Check your API key and try again.");
      setError("Using local fallback. Check Vercel env var and redeploy.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleNext() {
    if (currentIndex < routine.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsRunning(false);
    } else setIsComplete(true);
  }
  function handlePrev() {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  }
  function handleReset() {
    setCurrentIndex(0);
    setIsComplete(false);
    setIsResting(false);
    setIsRunning(false);
    setRepsDone(0);
    if (routine[0]) setTimeLeft(routine[0].duration);
  }

  const filtered = STRETCH_BANK.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.muscleGroup.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === "All" || s.category === filterCat;
    const matchesDiff = filterDiff === "All" || s.difficulty === filterDiff;
    return matchesSearch && matchesCat && matchesDiff;
  });

  const progress = current
    ? current.unit === "seconds"
      ? 1 - timeLeft / current.duration
      : repsDone / current.duration
    : 0;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-zinc-900">
      <header className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#2F4A2F] text-white flex items-center justify-center font-bold">F</div>
          <span className="font-bold text-xl tracking-tight">FlexAI</span>
          <span className="hidden sm:inline text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full ml-2">Gemini Coach</span>
        </div>
        <div className="text-sm text-zinc-500">{routine.length > 0 ? `${routine.length} stretches • ~${Math.ceil(totalTime / 60)} min` : "15 stretches in bank"}</div>
      </header>
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <section className="py-6 md:py-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">Stretch smarter,<br />not longer.</h1>
          <p className="mt-3 text-zinc-600 max-w-xl">Describe how you feel. Gemini picks a science-based routine strictly from your local stretch bank. 30-60s holds, 10-15 reps for dynamic moves.</p>
        </section>
        <div className="grid lg:grid-cols-5 gap-5">
          <section className="lg:col-span-2 bg-white rounded-3xl p-5 shadow-sm border border-zinc-100">
            <h2 className="font-bold text-lg">AI Coach</h2>
            <p className="text-sm text-zinc-500 mt-1">Describe your state, goal, or limitation.</p>
            <textarea value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)} className="w-full mt-4 min-h- rounded-2xl border border-zinc-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" placeholder="I sit at a desk all day and have tight hip flexors" />
            <div className="flex flex-wrap gap-2 mt-3">
              {QUICK_PROMPTS.map((q) => (
                <button key={q} onClick={() => setUserPrompt(q)} className={`text-xs px-3 py-1.5 rounded-full border ${userPrompt === q ? "bg-[#2F4A2F] text-white border-[#2F4A2F]" : "bg-white border-zinc-200"}`}>
                  {q.length > 28 ? q.slice(0, 28) + "..." : q}
                </button>
              ))}
            </div>
            <button onClick={handleGenerate} disabled={isGenerating} className="w-full mt-4 bg-[#2F4A2F] text-white py-3 rounded-2xl font-semibold disabled:opacity-50">
              {isGenerating ? "Generating with Gemini..." : "Generate My Routine"}
            </button>
            {error && <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-xl mt-3">{error}</p>}
            {reasoning && (
              <div className="mt-4 bg-emerald-50 rounded-2xl p-3 text-sm">
                <p className="font-semibold text-emerald-900">Why this routine</p>
                <p className="text-emerald-800 mt-1">{reasoning}</p>
              </div>
            )}
            {routine.length > 0 && (
              <div className="mt-4 space-y-2">
                {routine.map((s, i) => (
                  <div key={s.id} className={`flex items-center justify-between p-3 rounded-2xl border ${i === currentIndex ? "border-emerald-600 bg-emerald-50" : "border-zinc-100"}`}>
                    <div>
                      <p className="text-sm font-semibold">{i + 1}. {s.name}</p>
                      <p className="text-xs text-zinc-500">{s.muscleGroup} • {s.duration} {s.unit} • {s.category}</p>
                    </div>
                    <button onClick={() => setRoutine(routine.filter((_, idx) => idx !== i))} className="text-xs text-red-500 px-2 py-1">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="lg:col-span-3 bg-[#2F4A2F] text-white rounded-3xl p-5 md:p-7 shadow-sm relative overflow-hidden">
            {routine.length === 0 ? (
              <div className="h-full min-h- flex flex-col items-center justify-center text-center">
                <p className="text-3xl font-bold">Ready when you are</p>
                <p className="text-emerald-100/80 mt-2 max-w-sm text-sm">Generate a routine on the left, or add stretches from the library below. Your player will appear here.</p>
                <button onClick={handleGenerate} className="mt-5 bg-white text-[#2F4A2F] px-5 py-2.5 rounded-full font-semibold text-sm">Generate a sample routine</button>
              </div>
            ) : isComplete ? (
              <div className="h-full min-h- flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-white text-[#2F4A2F] flex items-center justify-center text-3xl">✓</div>
                <h3 className="text-3xl font-bold mt-4">Routine Complete</h3>
                <p className="text-emerald-100/80 mt-2">You did {routine.length} stretches in about {Math.ceil(totalTime / 60)} minutes.</p>
                <button onClick={handleReset} className="mt-5 bg-white text-[#2F4A2F] px-6 py-3 rounded-full font-semibold">Do it again</button>
              </div>
            ) : isResting ? (
              <div className="h-full min-h- flex flex-col items-center justify-center text-center">
                <p className="text-sm uppercase tracking-widest text-emerald-200">Breathe • Rest</p>
                <p className="text-7xl font-bold mt-3">{restLeft}s</p>
                <p className="mt-3">Next: {routine[currentIndex + 1]?.name}</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div key={current?.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center">
                    <div className="relative w-56 h-56 md:w-64 md:h-64"[STRIPPED 37 bytes]"0 0 100 100" className="w-full h-full -rotate-90">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" strokeDasharray={264} strokeDashoffset={264 * (1 - progress)} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {current?.unit === "seconds" ? (
                          <>
                            <span className="text-5xl md:text-6xl font-bold tabular-nums">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</span>
                            <span className="text-xs text-emerald-100/80 mt-1">remaining</span>
                          </>
                        ) : (
                          <>
                            <span className="text-5xl font-bold tabular-nums">{repsDone} / {current?.duration}</span>
                            <span className="text-xs text-emerald-100/80 mt-1">reps</span>
                          </>
                        )}
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs mt-4 text-emerald-100">
                      <input type="checkbox" checked={soundOn} onChange={(e) => setSoundOn(e.target.checked)} /> Beep on last 3 seconds
                    </label>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-widest text-emerald-200">Step {currentIndex + 1} of {routine.length} • {current?.category}</p>
                    <h3 className="text-3xl font-bold mt-2 leading-tight">{current?.name}</h3>
                    <p className="text-emerald-100/90 text-sm mt-2">{current?.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs bg-white/15 px-2 py-1 rounded-full">{current?.muscleGroup}</span>
                      <span className="text-xs bg-white/15 px-2 py-1 rounded-full">{current?.difficulty}</span>
                      <span className="text-xs bg-white/15 px-2 py-1 rounded-full">{current?.duration} {current?.unit}</span>
                    </div>
                    <div className="mt-4 space-y-1.5">
                      {current?.cues.map((c) => (
                        <p key={c} className="text-sm">• {c}</p>
                      ))}
                    </div>
                    {current?.unit === "reps" && (
                      <button onClick={handleRepComplete} className="mt-4 w-full bg-white text-[#2F4A2F] py-3 rounded-2xl font-bold">+ Complete Rep ({repsDone} / {current.duration})</button>
                    )}
                    <div className="flex gap-2 mt-4">
                      <button onClick={handlePrev} className="flex-1 bg-white/15 py-3 rounded-2xl text-sm font-semibold disabled:opacity-40" disabled={currentIndex === 0}>Previous</button>
                      <button onClick={() => setIsRunning(!isRunning)} className="flex-1 bg-white text-[#2F4A2F] py-3 rounded-2xl font-bold">{isRunning ? "Pause" : "Start"}</button>
                      <button onClick={handleNext} className="flex-1 bg-white/15 py-3 rounded-2xl text-sm font-semibold">Skip</button>
                    </div>
                    <button onClick={handleReset} className="w-full mt-2 text-xs text-emerald-100/70 py-2">Reset routine</button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </section>
        </div>
        <section className="mt-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">Stretch Library</h2>
            <div className="flex gap-2 flex-wrap">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search muscle or name..." className="px-3 py-2 rounded-full border border-zinc-200 text-sm bg-white" />
              <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="px-3 py-2 rounded-full border border-zinc-200 text-sm bg-white">
                <option>All</option><option>Dynamic Warm-up</option><option>Static Hold</option><option>Mobility</option>
              </select>
              <select value={filterDiff} onChange={(e) => setFilterDiff(e.target.value)} className="px-3 py-2 rounded-full border border-zinc-200 text-sm bg-white">
                <option>All</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {filtered.map((s) => (
              <div key={s.id} className="bg-white rounded-3xl p-4 border border-zinc-100 shadow-sm">
                <div className="flex justify-between">
                  <span className="text-xs px-2 py-1 rounded-full bg-zinc-100">{s.category}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-800">{s.difficulty}</span>
                </div>
                <h3 className="font-bold mt-3">{s.name}</h3>
                <p className="text-sm text-zinc-500 mt-1">{s.description}</p>
                <p className="text-xs text-zinc-500 mt-2">{s.muscleGroup} • {s.duration} {s.unit}</p>
                <button onClick={() => { setRoutine((prev) => [...prev, s]); setIsComplete(false); }} className="w-full mt-3 bg-[#2F4A2F] text-white py-2.5 rounded-xl text-sm font-semibold">Add to Routine</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
