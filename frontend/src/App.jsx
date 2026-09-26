import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, NavLink, Route, Routes } from "react-router-dom";

import Home from "./pages/Home.jsx";
import LiveTranslation from "./pages/LiveTranslation.jsx";
import About from "./pages/About.jsx";

const navigation = [
  { label: "Home", path: "/" },
  { label: "Translate", path: "/translate" },
  { label: "About", path: "/about" },
];

function App() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-slate-950 text-slate-100 transition-colors duration-500 dark:bg-slate-50 dark:text-slate-950">
        <Router>
          <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl dark:border-slate-200/30 dark:bg-white/90">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <NavLink to="/" className="text-2xl font-semibold tracking-tight text-slate-100 transition hover:text-indigo-300 dark:text-slate-950 dark:hover:text-indigo-600">
                ISL Voice
              </NavLink>

              <nav className="flex flex-wrap items-center gap-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `rounded-full px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                          : "text-slate-300 hover:bg-slate-800/80 hover:text-white dark:text-slate-700 dark:hover:bg-slate-200/80 dark:hover:text-slate-950"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <button
                onClick={toggleTheme}
                className="rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 dark:border-slate-300 dark:bg-white/90 dark:text-slate-950 dark:hover:bg-slate-200"
              >
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/translate" element={<LiveTranslation />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>

          <footer className="border-t border-slate-800/80 bg-slate-950/95 py-6 text-center text-sm text-slate-400 dark:border-slate-200/30 dark:bg-white/90 dark:text-slate-600">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              Built for a responsive ISL prediction website with a polished user interface.
            </div>
          </footer>
        </Router>
      </div>
    </div>
  );
}

export default App;
