"use client";

import { useEffect, useRef } from "react";
import { initOlaiPrototype } from "./olai-prototype";
import "./olai.css";

/**
 * Olai·AI — palm-leaf manuscript restoration workbench.
 *
 * The interactive prototype ships as vanilla JS (canvas pixel filters,
 * damage analysis, simulated restoration) in `olai-prototype.js`. This
 * component hosts the exact prototype DOM and boots the logic on mount,
 * keeping the original behaviour byte-for-byte while serving it as the
 * main Next.js app.
 */
export default function OlaiPrototype() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      initOlaiPrototype(rootRef.current);
    }
  }, []);

  return (
    <div ref={rootRef} className="olai-app">
      <header>
        <div className="brand">
          <span className="glyph">ஓலை</span>
          <span className="name">Olai · AI</span>
          <span className="tag">restoration workbench — prototype build</span>
        </div>
        <div className="header-actions">
          <button type="button" className="btn" id="resetBtn">
            Reset session
          </button>
        </div>
      </header>

      <div className="shell">
        {/* LEFT RAIL */}
        <nav className="rail" id="rail" aria-label="Restoration pipeline steps">
          <div className="rail-label">Pipeline</div>
          <div className="step" data-step="1" tabIndex={0}>
            <span className="num">1</span> Select leaf
          </div>
          <div className="step" data-step="2" tabIndex={0}>
            <span className="num">2</span> Preprocess
          </div>
          <div className="step" data-step="3" tabIndex={0}>
            <span className="num">3</span> Damage diagnosis
          </div>
          <div className="step" data-step="4" tabIndex={0}>
            <span className="num">4</span> AI restoration
          </div>
          <div className="step" data-step="5" tabIndex={0}>
            <span className="num">5</span> Translation
          </div>
          <div className="step" data-step="6" tabIndex={0}>
            <span className="num">6</span> Archive search
          </div>
        </nav>

        {/* MAIN STAGE */}
        <main className="stage" id="stage" />

        {/* INSPECTOR */}
        <aside className="inspector" id="inspector" />
      </div>

      <div className="footer-note">
        Prototype demo — image preprocessing &amp; damage analysis run for real
        on your device. Character-level restoration is simulated for
        demonstration; production connects to a fine-tuned Tamil OCR +
        grammar-validated language model.
      </div>
    </div>
  );
}
