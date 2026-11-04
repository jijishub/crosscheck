# CrossCheck! ⚖️

> **An Ace Attorney-inspired AI debate breakdown and learning platform.**  
> Transforming online debates, comment threads, and complex disagreements into entertaining, beginner-friendly courtroom dramas with live fact-checking, verifiable sources, and intuitive concept explainers.

---

## Overview

When people argue online, discussions often become polarized, jargon-dense, and difficult for newcomers to follow. The purpose of CrossCheck! is not to declare an arbitrary winner, but to:
1. **Uncover the root of disagreement** (e.g. historical baseline momentum vs. forward-looking exposure risks).
2. **Translate complex jargon** into plain English using relatable everyday analogies.
3. **Ground discussions in verifiable evidence** to distinguish established facts from speculative projections.

Inspired by *Ace Attorney*, CrossCheck! stages these disputes as a dramatic courtroom showdown complete with opposing debaters, dynamic expressions, theatrical callouts (`OBJECTION!`, `HOLD IT!`, `TAKE THAT!`, `POINT OF ORDER`), an interactive Court Record, and an impartial Jury synthesis board.

---

## Core Features

### 1. Docket & Case Intake (`src/components/DebateInputSection.tsx`, `src/lib/topic-utils.ts`)
- **Dual Tab Intake System:** Plaintext discussion and JSON argument contexts with real-time schema validation and instant trial previews.
- **Dynamic Topic Detection & Synchronization (`src/lib/topic-utils.ts`):** Automatically extracts the real discussion subject from post headers (`Post: "..."`, `Title: ...`, markdown headers, or leading premises) when pasting new debates, preventing stale default titles during AI deliberation.
- **Form Controls:** Quick 1-click "Clear Form" action for testing brand-new cases, alongside verified presets.

### 2. Visual Novel Courtroom Stage ⚖️
- **Opposing Debater Dual:** Defense Counsel (Melon) champions baseline trends, while Prosecution Analyst (Yon) stress-tests downside exposure.
- **Cinna Pre-Trial Briefing:** Before proceedings begin, Cinna introduces the case origin (authentic thread context), real-world background, participant positions, central disagreement, and learning objectives.
- **Cinna Educational Guide:** Explains concepts dynamically on first appearance, identifies unproven assumptions, and spot-checks numerical errors.
- **Interactive Dialogue Console:** Typewriter pacing, character audio blips, turn-by-turn stepping, instant reveal, authentic source comment inspector, and auto-play mode.
- **Cast Dossier:** Inspect full personality traits, speech styles, and bios for all court participants.

### 3. LangGraph Agentic Debate Pipeline
- **Multi-Node StateGraph Architecture:** Powered by `@langchain/langgraph` and `@langchain/core`:
  - `deconstructDebatersNode`: Analyzes submitted arguments and extracts opposing debater personas and stances.
  - `extractAndVerifyClaimsNode`: Audits factual and predictive claims with strict numerical unit checks (e.g. monthly records vs. annual totals) and primary source proof.
  - `buildPreTrialContextNode`: Dedicated context builder establishing grounded debate origin, real-world context, participant profiles, and learning objectives.
  - `scriptCourtroomDramaNode`: Dramatizes the conflict into theatrical visual novel turns linked with authentic forum quotes and Cinna's teaching notes.
  - `synthesizeJuryVerdictNode`: Produces an impartial jury synthesis, lists exposed misleading claims, Jargon Buster analogies, and actionable indicators for citizens.
- **Live Deliberation Screen (`ThinkingDeliberationScreen.tsx`):** Displays real-time case topics and stage-by-stage progress with Cinna's pondering animation throughout the 5-node deliberation sequence.
- **AI Provisioning Modes & Model Orchestration:**
  - **Primary AI (Gemini Flash / Luna):** High-speed claim extraction, research organization, and theatrical dialogue dramatization.
  - **Reasoning Specialist (Gemini Pro):** Deep evaluation of contradictory arguments, logical fallacies, and empirical evidence quality.
  - **Independent Evaluator (ChatGPT / GPT-6 Sol):** Cross-checks conclusions, detects unsupported assertions, and audits jury verdict.
  - **Lightweight / Token-Efficient (Flash-Lite / GPT-4o-Mini):** Fast classification and JSON schema formatting.
  - **Seed Test Mode:** Instantly loads verified discussion data for rapid UI and animation testing without API latency.
  - **Live LangGraph Mode:** Runs the full 5-stage agentic workflow via OpenAI-compatible gateway or direct Gemini fallback.

### 4. Court Record & Evidence Dossier ⚖️
- Modeled after the *Ace Attorney Court Record*.
- **Numerical & Scope Auditing:** Cross-checks claimed values against verified primary source data to spot unit conflation (e.g. monthly records vs. annual totals).
- **Authentic Quote Traceability:** Inspect the exact original forum comment and supporting source passage behind each claim.
- Search and filter verified sources by reliability rating (`Primary Data`, `Official Report`, `Expert Analysis`, `News Media`).
- Read primary source excerpts and follow live URLs gathered during research grounding.

### 5. Jury Chamber & Explainer Board ⚖️
- **Impartial Jury Synthesis:** Clarifies the core disagreement without forcing artificial binary outcomes on nuanced topics.
- **Misleading Claims Exposed:** Transparently highlights claims with numerical exaggerations or misattributions.
- **Jargon Buster:** Translates technical concepts into plain language with real-world analogies.
- **Evidence Ledger:** Categorizes all claims into Verified Facts, Contradicted Points, and Predictive Scenarios.
- **Citizen Takeaways:** Actionable economic indicators for ordinary readers to monitor.

### 6. Exportable Courtroom Dossier PDF ⚖️
- Generates an official, publication-quality multi-page legal dossier using `jspdf`.
- Includes official CrossCheck! header branding, Cinna's Pre-Trial Briefing, turn-by-turn trial transcript with original forum quotes, dedicated Verified Claims Dossier Matrix, complete Jury Verdict with citizen takeaways, and clickable source URLs.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS + Lucide React Icons
- **Document Engine:** `jspdf` (client-side multi-page PDF generation with native hyperlink annotations)
- **Audio Engine:** Custom Web Audio API synthesizer
- **AI Engine & Workflow:** LangGraph (`@langchain/langgraph` + `@langchain/core`) with OpenAI-compatible AI Gateway (`https://api.jizellecasia.site/v1/chat/completions`) and Google Gemini fallback

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env.local` file:
```env
AI_GATEWAY_URL=https://api.jizellecasia.site/v1/chat/completions
AI_GATEWAY_KEY=your_gateway_key_here
AI_MODEL=luna

# Optional Gemini Fallback
GEMINI_API_KEY=
```
*(You can also configure or override your gateway key directly in the AI Settings modal in the app).*

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
