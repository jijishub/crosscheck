# Courtroom Breakdown (Working Title) ⚖️🔍

> **An Ace Attorney-inspired AI debate breakdown and learning platform.**  
> Turning online debates and complex disagreements into entertaining, beginner-friendly courtroom dramas with live fact-checking, clear concept explanations, and traceable citations.

---

## 🎯 Project Vision & Intent

When people argue online (whether on Reddit, X/Twitter, or public forums), the discussion often becomes polarized, jargon-heavy, and confusing to outside observers. The true value often lies not in declaring an arbitrary "winner", but in understanding:
1. What the core disagreement actually is.
2. What underlying concepts and terms mean in plain language.
3. What verifiable data/evidence says versus what is opinion, interpretation, or conditional forecasting.

Inspired by the theatrical, point-counterpoint mechanics of *Ace Attorney* (opposing debaters, testimony, cross-examination, "Objection!" moments, and a Court Record of evidence), this platform reconstructs discussions into an interactive courtroom drama. The **Jury / Judge** acts as an impartial topic explainer and evidence synthesizer rather than a biased ref.

---

## 💡 Origin & Case Study

The idea originated from a Reddit debate regarding Philippine GDP growth:
- **Participant A (Melon / Optimistic baseline):** Emphasized historical macroeconomic growth patterns and consumer spending drivers.
- **Participant B (OpenYon / Cautious risk analysis):** Emphasized structural headwinds, inflation pressures, and fiscal slowdown risks.

Neither participant was purely "right" or "wrong"—they addressed different dimensions of the same reality (past patterns vs. future risk scenarios). This platform is designed to break down debates like this across economics, tech, science, public policy, and culture.

---

## 🚀 Agile P0 (MVP) Scope

The goal of P0 is the smallest end-to-end prototype that is entertaining, educational, and factually grounded:

```
[ Pasted Debate / Context ]
             ↓
[ AI Extraction & Live Research ]
   ├── Stance & Claim Decomposition
   ├── Fact vs Forecast vs Opinion Tagging
   └── Live Web Verification & Source Gathering
             ↓
[ Interactive Courtroom Presentation ]
   ├── Debater A (Defense) vs Debater B (Prosecution)
   ├── Theatrical Dialogue & Contradiction Spotlights
   └── Court Record (Evidence Dossier with Clickable Citations)
             ↓
[ The Jury's Educational Synthesis ]
   ├── Jargon Buster / Concept Explainer
   ├── Evidence Ledger (Verified / Contradicted / Unverified / Forecast)
   └── Neutral Nuanced Takeaway & Summary Lesson
```

### P0 Core Features
1. **Debate Ingestion:** Input box to paste raw discussion text (dialogue, thread comments, or claim pairs) plus optional topic tags.
2. **Analysis Pipeline:**
   - Extracts participants and their key arguments.
   - Categorizes statements (verifiable claim, value judgment, projection/forecast).
   - Queries live sources for checkable claims.
3. **The Courtroom View:**
   - Animated or staged speaker turns (Debater A vs Debater B).
   - "Hold It!" / "Take That!" prompts presenting relevant evidence.
   - Interactive Court Record showing evidence cards with direct links.
4. **The Jury Explainer:**
   - Breaks down technical terms in simple terms.
   - Delivers a balanced, evidence-backed synthesis without forcing an artificial binary winner.

---

## 🛡️ Core Editorial & Fact Principles

- **Traceable Sources:** Every factual claim must link to primary, credible sources with working URLs and publication dates.
- **No Hallucinated Citations:** If a claim cannot be verified or live search fails, explicitly state that it remains unverified.
- **Distinguish Facts from Forecasts:** Statistics and established historical data are distinct from predictive models and opinion.
- **Fair Representation:** Accurately represent debaters' actual points without strawmanning or injecting ideological bias.

---

## 🎨 Aesthetic & Character Pipeline

- **Inspiration:** Ace Attorney presentation (dual podiums, dramatic reveals, pixel/2D courtroom flair, evidence dossiers).
- **Original Assets:** AI-assisted original 2D character sprites (Debater A, Debater B, Judge/Jury Foreperson, Courtroom background).
- **Customization (Future):** Designed to support custom asset themes (e.g., custom character skins) in later releases.

---

## 📚 References & Inspirations

- *Ace Attorney* (Capcom) – Dialogue pacing, cross-examination flow, and evidence presentation mechanics.
- Fact-Checking Frameworks – Distinction between verified facts, context-dependent nuances, and forward-looking opinions.
- Motivating Reddit Case – Philippine GDP Growth Analysis (Melon vs OpenYon).

---

## 🛠️ Stack & Implementation (Proposed / Pending Confirmation)

- **Frontend & App Framework:** Next.js (React + TypeScript) + Tailwind CSS + Lucide Icons + Canvas/Framer Motion animations.
- **State & Audio:** Web Audio API for classic courtroom sound effects (gavel hits, blips, dramatic stingers).
- **AI & Research Engine:** Multi-step LLM pipeline (Extractor -> Web Search / Grounding -> Script Writer -> Jury Explainer).
