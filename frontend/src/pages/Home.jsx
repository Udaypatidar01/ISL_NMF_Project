import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-slate-950/40 dark:from-white dark:via-slate-50 dark:to-slate-100 dark:border-slate-200">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-indigo-400">Welcome to ISL Voice</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-white dark:text-slate-950 sm:text-6xl">
              Translate sign language gestures into words and sentences.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 dark:text-slate-700 sm:text-lg">
              A sleek and responsive website that lets you capture one webcam feed, converts hand signs into letters, and builds sentences with smart suggestions.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/translate"
                className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400"
              >
                Start translating
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 px-6 py-3 text-base font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800 dark:border-slate-300 dark:bg-white/90 dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Learn more
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/30 dark:bg-white/90">
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5 dark:border-slate-200 dark:bg-slate-50">
              <p className="text-sm text-slate-400 dark:text-slate-600">Live translation preview</p>
              <div className="mt-6 min-h-[280px] rounded-[1.5rem] bg-gradient-to-br from-indigo-500 via-slate-900 to-slate-950 p-6 text-white shadow-xl shadow-indigo-500/20 dark:from-indigo-400 dark:via-slate-200 dark:to-slate-100 dark:text-slate-950">
                <div className="text-xs uppercase tracking-[0.32em] text-slate-200/80 dark:text-slate-600">Webcam Preview</div>
                <div className="mt-8 space-y-4">
                  <div className="rounded-3xl bg-slate-950/50 p-4 text-lg font-semibold">A</div>
                  <div className="rounded-3xl bg-slate-950/50 p-4 text-lg font-semibold">B</div>
                  <div className="rounded-3xl bg-slate-950/50 p-4 text-lg font-semibold">C</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Responsive layout",
            description: "Optimized for desktop, tablet, and mobile screens with a modern user interface.",
          },
          {
            title: "One webcam feed",
            description: "Control the camera on/off and view a single smooth sketch-style preview for real-time capture.",
          },
          {
            title: "Sentence builder",
            description: "Combine predicted letters into full words and sentences with intuitive controls.",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-xl shadow-slate-950/20 dark:border-slate-200 dark:bg-white/90">
            <h2 className="text-xl font-semibold text-slate-100 dark:text-slate-950">{item.title}</h2>
            <p className="mt-4 text-slate-400 dark:text-slate-700">{item.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
