# CrossCheck! ⚖️🔍

> **An Ace Attorney-inspired AI debate breakdown and learning platform.**  
> Transforming online debates, comment threads, and complex disagreements into entertaining, beginner-friendly courtroom dramas with live fact-checking, verifiable sources, and intuitive concept explainers.

---

## 🎯 Project Vision & Intent

When people argue online (whether on Reddit, X/Twitter, or public forums), discussions often become polarized, jargon-dense, and difficult for newcomers to follow. The true educational value is rarely about declaring an arbitrary "winner", but rather:
1. **Understanding the real root of disagreement** (e.g., historical baselines vs. future risk scenarios).
2. **De-mystifying jargon and concepts** using plain English and relatable analogies.
3. **Establishing what credible evidence proves** versus what is projection, opinion, or conditional forecasting.

Inspired by the theatrical, point-counterpoint mechanics of *Ace Attorney* (opposing debater podiums, dynamic expression changes, "OBJECTION!" / "HOLD IT!" stingers, an interactive Court Record dossier, and an impartial Jury explanation board), CrossCheck! recreates those learning moments across economics, technology, public policy, and science.

---

## 💡 Motivating Case Study

The idea originated from an authentic Reddit discussion regarding Philippine GDP growth:
- **Participant A (Melon / Baseline Optimist):** Emphasized historical macroeconomic growth trends (2010–2019 averaging 6.0–6.5%), consumer spending resilience, and steady remittances exceeding $35B.
- **Participant B (Yon / Structural Risk Analyst):** Emphasized 2023 growth slowing to 5.6%, policy interest rates at 6.50% constraining borrowing, and debt-to-GDP surpassing 60% post-pandemic.

Neither participant was purely wrong—they were examining different dimensions of economic reality (historical momentum vs. forward-looking structural risk). This platform breaks down debates like this with live search validation and beginner-accessible concept translations.

---

## 🚀 Implemented Features (Agile P0)

### 1. Docket & Case Intake (`src/components/DebateInputSection.tsx`)
- **Dual Tab Intake System:**
  - **Tab 1: Plaintext Discussion:** Paste any raw Reddit comments, tweet threads, or dialogue transcripts.
  - **Tab 2: JSON Argument Context:** Direct JSON intake for raw comment threads (e.g. `philippines_reddit_debate_comments.json`) or full case schemas with live validation, formatting, and instant trial preview.
- **Quick Test Presets:**
  - 🇵🇭 *Philippine GDP Growth Forecast (Melon vs Yon)*
  - 💻 *AI Coding Assistants: Velocity Multiplier vs Architecture Debt (Alex vs Sam)*
- **API Key & Gateway Management:** Pre-configured with OpenAI-compatible gateway (`luna` at `https://api.jizellecasia.site/v1/chat/completions`) or custom override keys.

### 2. The Courtroom Stage (`src/components/CourtroomStage.tsx`)
- **Visual Novel Duel View:** Defense (Melon) on the left, Prosecution (Yon) on the right, standing at polished mahogany courtroom benches with active speaker spotlight.
- **Cinna Mascot Companion (`src/components/CinnaNarrator.tsx`):** Sits cutely right on the dialogue box banner, reacting with dynamic expressions (`Bailiff/Order`, `Cheerful`, `Pondering`, `Shocked!`) to guide beginners through complex points.
- **Character Profiles & Cast Dossier (`src/components/CharacterProfilesModal.tsx`):** Inspect full personality traits, catchphrases, speech styles, and bios for Melon, Yon, Cinna, and the Jury Foreperson.
- **Interactive Dialogue Box:** Typewriter text with character blips, turn-by-turn stepping, instant text reveal, auto-play mode, and transcript log.
- **Dramatic Callout Banners:** Animated comic-burst stingers for `"OBJECTION!"`, `"HOLD IT!"`, and `"TAKE THAT!"` paired with synthesized Web Audio sound effects.
- **Sleek Single-Line Dispute Ribbon:** Highlights the exact claim under examination or newly presented evidence without blocking characters.

### 3. Web Audio SFX Synthesizer (`src/lib/audio.ts`)
- Zero external audio file dependencies. Built with browser Web Audio API:
  - Typewriter text blips (pitch-tuned per character)
  - Gavel strike & table slam impact
  - "Objection!" dramatic stingers & C-major chord accents
  - Evidence presented / "Take That!" chimes
  - Persistent audio mute/unmute control.

### 4. Interactive Court Record / Evidence Dossier (`src/components/CourtRecord.tsx`)
- Modeled after the *Ace Attorney Court Record*.
- Search and filter verified sources by reliability rating (`Primary Data`, `Official Report`, `Expert Analysis`, `News Media`).
- Inspect primary source excerpts, publication dates, and direct links to live URLs gathered during the search grounding pipeline.
- Cross-references which claims were verified, contradicted, or flagged as speculative.

### 5. The Jury Chamber & Explainer Board (`src/components/JuryBoard.tsx`)
- **The Jury Foreperson's Impartial Synthesis:** Clarifies the core disagreement and provides a qualified breakdown without forcing an artificial binary winner on predictive or mixed topics.
- **Jargon Buster (Concept Guide):** Translates dense technical terms into plain English with everyday analogies.
- **The Evidence Ledger:** Groups all claims by status (Verified Facts, Contradicted Claims, and Future Forecasts / Conditional Scenarios).
- **Educational Takeaway:** Delivers the essential lesson readers should understand after viewing the debate.

### 6. Visual Novel Assets & Backdrops (`public/characters/`, `public/scenes_and_overlays/`, `public/Cinna_*.png`)
- **Active Sprites**: Integrated high-res character sprites in `public/characters/` for Debater A (Melon), Debater B (Yon), and Jury Foreperson.
- **Brand Assets**: Custom `crosscheck logo.png` banner integrated into navigation, and `crosscheck favicon.png` / `icon.png` wired into Next.js App Router metadata.
- **Cinna Mascot Narrator**: Integrated `CinnaNarrator` (`public/Cinna_1.png` - `Cinna_4.png`) as a cute courtroom bailiff/commentator who reacts to intense turns, objections, and explains core claims to beginners.
- **Courtroom Stage**: Features `Backdrop_01_Main_Courtroom.png` as the cinematic courtroom backdrop with ambient lighting.
- **Jury Deliberation Chamber**: Features `Backdrop_02_Jury_Chamber.png` in the jury explanation header.
- **Theatrical Overlays**: Graphic comic bursts for `OBJECTION!`, `HOLD IT!`, and `TAKE THAT!` with screen-shake feedback.
- **Seeded Authentic Debate**: Pre-seeded with authentic Philippine GDP discussion comments from `philippines_reddit_debate_comments.json` (5.8% baseline forecast vs OECD downside exposure).
- **Prompts**: All generation briefs preserved in [asset_prompts.txt](asset_prompts.txt).

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS + Lucide React Icons
- **Audio Engine:** Custom Web Audio API synthesizer
- **AI Engine:** AI Gateway (`https://api.jizellecasia.site/v1/chat/completions`) powering model `luna` (OpenAI-compatible) with optional Google Gemini fallback
- **Package Manager:** `pnpm` / `npm`

---

## ⚡ Quick Start

### 1. Install Dependencies & Run Dev Server
```bash
# If pnpm is already recognized in your terminal:
pnpm dev

# If pnpm command is not yet in your terminal session PATH:
npx pnpm dev
# or
npm run dev
```

### 2. Configure AI Gateway / Keys
Create or check `.env.local`:
\`\`\`env
AI_GATEWAY_URL=https://api.jizellecasia.site/v1/chat/completions
AI_GATEWAY_KEY=your_gateway_key_here
AI_MODEL=luna

# Optional Gemini Fallback
GEMINI_API_KEY=
\`\`\`
*(Alternatively, enter or override your gateway key directly in the Court Docket header in the app).*

### 3. Run the Development Server
\`\`\`bash
pnpm dev
# or
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Development Guidelines & Skills

- `!readme`: Maintained and synchronized with all implemented architectural components, case studies, and references.
- `!git-m`: Strict one-line commit messages for all repository commits.
- Single Source of Truth: All project requirements preserved from `llm.txt`.
