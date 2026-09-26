import React from "react";

export default function About() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40 dark:border-slate-200 dark:bg-white/90">
        <h1 className="text-4xl font-semibold text-slate-100 dark:text-slate-950">About ISL Voice</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400 dark:text-slate-700">
          This website is designed to make Indian Sign Language translation accessible via a polished customer-facing interface.
          It uses one webcam preview and provides letter suggestions, word building, and sentence composition so users can communicate naturally.
        </p>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-6 dark:border-slate-200 dark:bg-slate-50">
            <h2 className="text-xl font-semibold text-slate-100 dark:text-slate-950">Beautiful UI</h2>
            <p className="mt-3 text-slate-400 dark:text-slate-700">
              The interface is clean, colorful, and friendly on both desktop and mobile devices.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-6 dark:border-slate-200 dark:bg-slate-50">
            <h2 className="text-xl font-semibold text-slate-100 dark:text-slate-950">Simple controls</h2>
            <p className="mt-3 text-slate-400 dark:text-slate-700">
              Camera toggle, theme switching, and sentence controls keep the experience intuitive for all users.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 shadow-xl shadow-slate-950/20 dark:border-slate-200 dark:bg-white/90">
        <h2 className="text-3xl font-semibold text-slate-100 dark:text-slate-950">How to use</h2>
        <ol className="mt-6 space-y-4 text-slate-400 dark:text-slate-700">
          <li className="rounded-3xl border border-slate-800 bg-slate-900/95 p-5 dark:border-slate-200 dark:bg-slate-50">
            1. Navigate to Translate and allow camera access.
          </li>
          <li className="rounded-3xl border border-slate-800 bg-slate-900/95 p-5 dark:border-slate-200 dark:bg-slate-50">
            2. Show your hand gesture to the camera and watch the live prediction update.
          </li>
          <li className="rounded-3xl border border-slate-800 bg-slate-900/95 p-5 dark:border-slate-200 dark:bg-slate-50">
            3. Tap the suggested letters to build words, then add spaces and punctuation to form sentences.
          </li>
        </ol>
      </section>
    </div>
  );
}
