import jsPDF from 'jspdf';
import {
  DebateAnalysisResult,
  DialogueTurn,
  Claim,
  EvidenceItem,
} from '@/types/debate';

/**
 * Strips all 4-byte emojis and multi-byte Unicode characters that cause
 * mojibake/garbled glyphs in Type 1 Helvetica font.
 * Replaces common motifs with clean, professional textual labels.
 */
export function cleanPdfText(text: string | undefined | null): string {
  if (!text) return '';
  return text
    // Replace emojis with clean badges
    .replace(/⚖️|⚖/g, '[JURY]')
    .replace(/⚔️|⚔/g, '[PROSECUTION]')
    .replace(/🐾|🐱|🐶/g, '[BAILIFF]')
    .replace(/🎯/g, '[CLAIM]')
    .replace(/📁/g, '[EVIDENCE]')
    .replace(/🔗/g, '[LINK]')
    .replace(/⚡/g, '[!]')
    .replace(/🔥/g, '[INTENSE]')
    .replace(/🤔/g, '[NOTE]')
    .replace(/✨/g, '[*]')
    .replace(/✓/g, '[OK]')
    .replace(/⚠/g, '[WARN]')
    .replace(/•/g, '-')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[—–]/g, '-')
    // Strip any remaining non-ASCII characters that corrupt standard PDF fonts
    .replace(/[^\x20-\x7E\r\n\t]/g, '')
    .trim();
}

/**
 * Asynchronously loads an image from a URL into an HTMLImageElement
 */
function loadBrowserImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window not available'));
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Derives Cinna's mascot commentary for a dialogue turn (pure commentary, clean ASCII)
 */
export function getCinnaTakeForTurn(
  turn: DialogueTurn,
  claim?: Claim,
  evidence?: EvidenceItem
): string {
  if (turn.cinnaTeachingNote?.explanation) {
    const conceptTag = turn.cinnaTeachingNote.concept ? `[${cleanPdfText(turn.cinnaTeachingNote.concept)}] ` : '';
    const fallacyTag = turn.cinnaTeachingNote.fallacyOrAssumption
      ? ` (Spotcheck: ${cleanPdfText(turn.cinnaTeachingNote.fallacyOrAssumption)})`
      : '';
    return `${conceptTag}${cleanPdfText(turn.cinnaTeachingNote.explanation)}${fallacyTag}`;
  }
  const speaker = cleanPdfText(turn.speakerName) || 'the debater';
  if (turn.callout) {
    return `[${cleanPdfText(turn.callout)}] ${speaker} challenges the opposing argument with urgency!`;
  }
  if (turn.emotion === 'intense') {
    return `Intense cross-examination from ${speaker}! Pressing on crucial downside vulnerabilities!`;
  }
  if (turn.emotion === 'thinking') {
    return `Cinna's Note: Notice how this point stress-tests whether external shocks disrupt the baseline forecast.`;
  }
  if (turn.emotion === 'synthesis' || turn.speakerId === 'jury') {
    return `Cinna's Note: Impartial synthesis in action! Connecting both empirical trends into a balanced reality.`;
  }
  if (evidence) {
    return `Evidence filed in the trial record. See the Complete Evidence Ledger in the dossier below.`;
  }
  if (claim) {
    return `Key claim cited by ${speaker}. See the Claims Verification Matrix in the dossier below.`;
  }
  return `Tracking courtroom debate momentum between ${speaker} and the evidence record.`;
}

/**
 * Generates an official, beautifully structured, multi-page Courtroom Dossier PDF.
 * Dialogues remain purely focused on theatrical courtroom turns and Cinna's commentary.
 * Claims and Evidence are organized into their own dedicated Dossier and Ledger sections.
 */
export async function exportCourtroomDebatePDF(debate: DebateAnalysisResult): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // ~595.28 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // ~841.89 pt
  const marginX = 40;
  const contentWidth = pageWidth - marginX * 2; // ~515.28 pt
  let currentY = 36;

  // Preload CrossCheck! logo
  let logoImg: HTMLImageElement | null = null;
  try {
    logoImg = await loadBrowserImage('/crosscheck logo.png');
  } catch (err) {
    console.warn('Could not load logo image for PDF:', err);
  }

  // Running Header Helper for subsequent pages
  const drawRunningHeader = () => {
    doc.setFillColor(254, 243, 199); // Warm Honey
    doc.rect(marginX, 18, contentWidth, 16, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(120, 53, 15);
    doc.text('CROSSCHECK! OFFICIAL COURT RECORD & JURY SYNTHESIS', marginX + 8, 29);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(140, 83, 56);
    const topicSnippet = cleanPdfText(debate.topic);
    const shortTopic = topicSnippet.length > 50 ? topicSnippet.slice(0, 48) + '...' : topicSnippet;
    doc.text(`Docket: ${shortTopic}`, pageWidth - marginX - 8, 29, { align: 'right' });
    doc.setDrawColor(229, 201, 166);
    doc.line(marginX, 36, pageWidth - marginX, 36);
  };

  // Helper: ensure enough vertical space on the current page
  const ensureSpace = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 50) {
      doc.addPage();
      currentY = 46;
      drawRunningHeader();
    }
  };

  // Lookups
  const claimsMap = new Map<string, Claim>();
  debate.claims.forEach((c) => claimsMap.set(c.id, c));
  const evidenceMap = new Map<string, EvidenceItem>();
  debate.evidenceRecord.forEach((e) => evidenceMap.set(e.id, e));

  // ==========================================
  // PAGE 1: OFFICIAL COVER & HEADER
  // ==========================================

  // Title Banner Frame
  const headerHeight = 76;
  doc.setFillColor(253, 242, 248); // Pastel Pink
  doc.setDrawColor(244, 114, 182);
  doc.setLineWidth(1.5);
  doc.roundedRect(marginX, currentY, contentWidth, headerHeight, 8, 8, 'FD');

  // Embed Logo on Left
  const logoWidth = 126;
  const logoHeight = 42; // exact 3:1 ratio
  if (logoImg) {
    try {
      doc.addImage(logoImg, 'PNG', marginX + 12, currentY + 16, logoWidth, logoHeight);
    } catch {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(131, 24, 67);
      doc.text('CrossCheck!', marginX + 14, currentY + 40);
    }
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(131, 24, 67);
    doc.text('CrossCheck!', marginX + 14, currentY + 40);
  }

  // Header Text on Right
  const textStartX = marginX + logoWidth + 24;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(131, 24, 67);
  doc.text('COURT OF PUBLIC INQUIRY', textStartX, currentY + 24);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9);
  doc.text('OFFICIAL TRIAL TRANSCRIPT & JURY VERDICT DOSSIER', textStartX, currentY + 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const docketNumber = `DOCKET #${Math.abs(debate.topic.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)).toString().slice(0, 8)}`;
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.text(`${docketNumber}  |  Filed: ${dateStr}`, textStartX, currentY + 54);

  currentY += headerHeight + 12;

  // Case Subject Matter Box
  const cleanTopic = cleanPdfText(debate.topic);
  const splitTopic = doc.splitTextToSize(cleanTopic, contentWidth - 24);
  const topicBoxHeight = 24 + splitTopic.length * 12 + 8;

  doc.setFillColor(255, 253, 249);
  doc.setDrawColor(229, 201, 166);
  doc.setLineWidth(1);
  doc.roundedRect(marginX, currentY, contentWidth, topicBoxHeight, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 53, 15);
  doc.text('CASE TOPIC / SUBJECT MATTER:', marginX + 12, currentY + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(45, 24, 37);
  doc.text(splitTopic, marginX + 12, currentY + 30);

  currentY += topicBoxHeight + 10;

  // Executive Context Summary
  if (debate.contextSummary) {
    const cleanContext = cleanPdfText(debate.contextSummary);
    const splitContext = doc.splitTextToSize(cleanContext, contentWidth - 24);
    const contextHeight = 18 + splitContext.length * 10 + 8;

    doc.setFillColor(250, 245, 235);
    doc.setDrawColor(229, 201, 166);
    doc.roundedRect(marginX, currentY, contentWidth, contextHeight, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(146, 64, 14);
    doc.text('CONTEXT & INTAKE SUMMARY:', marginX + 10, currentY + 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(75, 85, 99);
    doc.text(splitContext, marginX + 10, currentY + 23);

    currentY += contextHeight + 10;
  }

  // Participants & Advocates Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(131, 24, 67);
  doc.text('TRIAL PARTICIPANTS & PERSPECTIVE ADVOCATES:', marginX, currentY);
  currentY += 10;

  const halfWidth = (contentWidth - 10) / 2;

  // Debater A (Defense)
  const debaterAName = cleanPdfText(debate.debaterA.name);
  const debaterATitle = cleanPdfText(debate.debaterA.archetypeTitle);
  const debaterAStance = cleanPdfText(debate.debaterA.coreStance);
  const splitAStance = doc.splitTextToSize(debaterAStance, halfWidth - 16);

  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(125, 211, 252);
  doc.roundedRect(marginX, currentY, halfWidth, 74, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(3, 105, 161);
  doc.text(`[DEFENSE] ${debaterAName}`, marginX + 8, currentY + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(2, 132, 199);
  doc.text(debaterATitle, marginX + 8, currentY + 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(12, 74, 110);
  doc.text(splitAStance.slice(0, 3), marginX + 8, currentY + 40);

  // Debater B (Prosecution)
  const debaterBName = cleanPdfText(debate.debaterB.name);
  const debaterBTitle = cleanPdfText(debate.debaterB.archetypeTitle);
  const debaterBStance = cleanPdfText(debate.debaterB.coreStance);
  const splitBStance = doc.splitTextToSize(debaterBStance, halfWidth - 16);

  doc.setFillColor(255, 241, 242);
  doc.setDrawColor(253, 164, 175);
  doc.roundedRect(marginX + halfWidth + 10, currentY, halfWidth, 74, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(159, 18, 57);
  doc.text(`[PROSECUTION] ${debaterBName}`, marginX + halfWidth + 18, currentY + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(190, 18, 60);
  doc.text(debaterBTitle, marginX + halfWidth + 18, currentY + 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(136, 19, 55);
  doc.text(splitBStance.slice(0, 3), marginX + halfWidth + 18, currentY + 40);

  currentY += 84;

  // Companions Bar: Cinna & Jury
  doc.setFillColor(250, 245, 255);
  doc.setDrawColor(216, 180, 254);
  doc.roundedRect(marginX, currentY, contentWidth, 38, 6, 6, 'FD');

  // Left column: Cinna
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(88, 28, 135);
  doc.text('[COURT BAILIFF] Cinna', marginX + 10, currentY + 13);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(107, 33, 168);
  doc.text('Dynamic reactions, baby-step explanations & evidence checks.', marginX + 10, currentY + 25);

  // Right column: Jury Foreperson
  const juryColX = marginX + contentWidth / 2 + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(88, 28, 135);
  doc.text('[JURY FOREPERSON] Academic Jurist', juryColX, currentY + 13);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(107, 33, 168);
  doc.text('Delivers impartial synthesis and concept translations.', juryColX, currentY + 25);

  currentY += 48;

  // ==========================================
  // CINNA'S PRE-TRIAL BRIEFING & AUTHENTIC CASE ORIGIN
  // ==========================================
  if (debate.preTrialBriefing) {
    const briefing = debate.preTrialBriefing;
    ensureSpace(60);

    doc.setFillColor(252, 231, 243);
    doc.setDrawColor(244, 114, 182);
    doc.rect(marginX, currentY, contentWidth, 20, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(131, 24, 67);
    doc.text("CINNA'S PRE-TRIAL BRIEFING: AUTHENTIC CASE ORIGIN & CONTEXT", marginX + 10, currentY + 14);

    currentY += 28;

    // 1. Origin
    const cleanOriginTitle = cleanPdfText(briefing.origin.postTitle);
    const cleanCircumstances = cleanPdfText(briefing.origin.circumstances);
    const originText = `1. ORIGIN [${cleanPdfText(briefing.origin.platform)}]: "${cleanOriginTitle}". ${cleanCircumstances}`;
    const splitOrigin = doc.splitTextToSize(originText, contentWidth - 16);

    // 2. Real-World Issue
    const cleanIssue = cleanPdfText(briefing.context.realWorldIssue);
    const splitIssue = doc.splitTextToSize(`2. REAL-WORLD CONTEXT: ${cleanIssue}`, contentWidth - 16);

    // 3. Central Disagreement
    const cleanDisagreement = cleanPdfText(briefing.centralDisagreement.coreQuestion);
    const cleanWhy = cleanPdfText(briefing.centralDisagreement.whyItMatters);
    const splitDisagreement = doc.splitTextToSize(`3. CENTRAL DISAGREEMENT: ${cleanDisagreement} (Why It Matters: ${cleanWhy})`, contentWidth - 16);

    // 4. Learning Objectives
    const cleanObjectives = briefing.learningObjectives.map((o, i) => `${i + 1}. ${cleanPdfText(o)}`).join('  |  ');
    const splitObjectives = doc.splitTextToSize(`4. LEARNING OBJECTIVES: ${cleanObjectives}`, contentWidth - 16);

    // Cinna Narration
    const cleanNarration = cleanPdfText(briefing.cinnaNarration);
    const splitNarration = doc.splitTextToSize(`[Cinna's Welcome]: "${cleanNarration}"`, contentWidth - 24);

    const briefingHeight =
      splitOrigin.length * 9.5 +
      splitIssue.length * 9.5 +
      splitDisagreement.length * 9.5 +
      splitObjectives.length * 9.5 +
      splitNarration.length * 9 +
      38;

    ensureSpace(briefingHeight);

    doc.setFillColor(255, 253, 249);
    doc.setDrawColor(244, 114, 182);
    doc.roundedRect(marginX, currentY, contentWidth, briefingHeight, 5, 5, 'FD');

    let briefY = currentY + 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(45, 24, 37);

    doc.text(splitOrigin, marginX + 8, briefY);
    briefY += splitOrigin.length * 9.5 + 4;

    doc.text(splitIssue, marginX + 8, briefY);
    briefY += splitIssue.length * 9.5 + 4;

    doc.text(splitDisagreement, marginX + 8, briefY);
    briefY += splitDisagreement.length * 9.5 + 4;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(6, 95, 70);
    doc.text(splitObjectives, marginX + 8, briefY);
    briefY += splitObjectives.length * 9.5 + 6;

    // Cinna Narration Box
    const narrBoxH = splitNarration.length * 9 + 8;
    doc.setFillColor(253, 242, 248);
    doc.setDrawColor(244, 114, 182);
    doc.roundedRect(marginX + 6, briefY, contentWidth - 12, narrBoxH, 3, 3, 'FD');

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(131, 24, 67);
    doc.text(splitNarration, marginX + 12, briefY + 8);

    currentY += briefingHeight + 12;
  }

  // ==========================================
  // PHASE 1: COURTROOM TRANSCRIPT & CONVERSATION LOGS
  // (Pure dialogue & Cinna's commentary - Claims & Evidence moved to Dossier)
  // ==========================================
  ensureSpace(45);

  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(245, 158, 11);
  doc.rect(marginX, currentY, contentWidth, 20, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(120, 53, 15);
  doc.text('PHASE 1: THE COURTROOM TRANSCRIPT & DIALOGUE LOGS', marginX + 10, currentY + 14);

  currentY += 28;

  debate.script.forEach((turn, idx) => {
    const isDebaterA = turn.speakerId === 'debater_a';
    const isJury = turn.speakerId === 'jury';
    const activeClaim = turn.activeClaimId ? claimsMap.get(turn.activeClaimId) : undefined;
    const presentedEvidence = turn.presentedEvidenceId ? evidenceMap.get(turn.presentedEvidenceId) : undefined;
    const cinnaTake = cleanPdfText(getCinnaTakeForTurn(turn, activeClaim, presentedEvidence));

    // Spoken dialogue text wrapping
    const cleanDialogue = cleanPdfText(turn.text);
    const splitDialogue = doc.splitTextToSize(`"${cleanDialogue}"`, contentWidth - 28);
    const splitCinna = doc.splitTextToSize(cinnaTake, contentWidth - 36);

    const hasOrig = Boolean(turn.originalCommentQuote);
    const splitOrig = hasOrig
      ? doc.splitTextToSize(`Original Forum Comment: "${cleanPdfText(turn.originalCommentQuote!)}"`, contentWidth - 28)
      : [];

    const dialogueHeight = splitDialogue.length * 11;
    const origHeight = hasOrig ? splitOrig.length * 9 + 6 : 0;
    const cinnaBoxHeight = 18 + splitCinna.length * 10 + 4;

    // Pure dialogue card height (with optional original comment line)
    const totalCardHeight = 24 + dialogueHeight + origHeight + 8 + cinnaBoxHeight + 10;

    ensureSpace(totalCardHeight);

    // Card Background Frame
    if (isJury) {
      doc.setFillColor(250, 245, 255);
      doc.setDrawColor(192, 132, 252);
    } else if (isDebaterA) {
      doc.setFillColor(240, 249, 255);
      doc.setDrawColor(125, 211, 252);
    } else {
      doc.setFillColor(255, 241, 242);
      doc.setDrawColor(253, 164, 175);
    }

    doc.setLineWidth(1);
    doc.roundedRect(marginX, currentY, contentWidth, totalCardHeight, 6, 6, 'FD');

    let innerY = currentY + 14;

    // Header Line: Turn Tag & Callout
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    if (isJury) {
      doc.setTextColor(88, 28, 135);
    } else if (isDebaterA) {
      doc.setTextColor(3, 105, 161);
    } else {
      doc.setTextColor(159, 18, 57);
    }

    const cleanSpeaker = cleanPdfText(turn.speakerName).toUpperCase();
    const roleTag = isJury ? 'JURY FOREPERSON' : isDebaterA ? 'DEFENSE' : 'PROSECUTION';
    doc.text(`TURN ${idx + 1} OF ${debate.script.length}  -  ${cleanSpeaker} [${roleTag}]`, marginX + 12, innerY);

    if (turn.callout) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(225, 29, 72);
      doc.text(`[${cleanPdfText(turn.callout)}]`, pageWidth - marginX - 12, innerY, { align: 'right' });
    } else if (turn.emotion) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Emotion: ${cleanPdfText(turn.emotion)}`, pageWidth - marginX - 12, innerY, { align: 'right' });
    }

    innerY += 13;

    // Spoken Dialogue Lines
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(45, 24, 37);
    doc.text(splitDialogue, marginX + 12, innerY);
    innerY += dialogueHeight + 4;

    // Original Comment Quote Trace
    if (hasOrig && splitOrig.length > 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(180, 83, 9);
      doc.text(splitOrig, marginX + 12, innerY);
      innerY += origHeight + 2;
    } else {
      innerY += 4;
    }

    // Cinna Mascot Take Box
    doc.setFillColor(255, 253, 249);
    doc.setDrawColor(244, 114, 182);
    doc.roundedRect(marginX + 10, innerY, contentWidth - 20, cinnaBoxHeight, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(131, 24, 67);
    doc.text('[CINNA - COURT BAILIFF]:', marginX + 16, innerY + 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(80, 20, 50);
    doc.text(splitCinna, marginX + 16, innerY + 22);

    currentY += totalCardHeight + 10;
  });

  // ==========================================
  // PHASE 2: JURY DELIBERATION & IMPARTIAL FINDINGS
  // ==========================================
  ensureSpace(60);

  doc.setFillColor(243, 232, 255);
  doc.setDrawColor(192, 132, 252);
  doc.rect(marginX, currentY, contentWidth, 20, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(88, 28, 135);
  doc.text('PHASE 2: THE JURY DELIBERATION & IMPARTIAL FINDINGS', marginX + 10, currentY + 14);

  currentY += 28;

  // Balanced Verdict Box
  const rawVerdict = debate.juryVerdict.balancedVerdict || debate.juryVerdict.educationalTakeaway;
  const cleanVerdict = cleanPdfText(rawVerdict);
  const splitVerdict = doc.splitTextToSize(cleanVerdict, contentWidth - 24);
  const verdictHeight = 26 + splitVerdict.length * 11 + 6;

  ensureSpace(verdictHeight);

  doc.setFillColor(255, 253, 249);
  doc.setDrawColor(192, 132, 252);
  doc.setLineWidth(1.2);
  doc.roundedRect(marginX, currentY, contentWidth, verdictHeight, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(88, 28, 135);
  doc.text('[JURY FOREPERSON: BALANCED SYNTHESIS VERDICT]', marginX + 12, currentY + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(45, 24, 37);
  doc.text(splitVerdict, marginX + 12, currentY + 28);

  currentY += verdictHeight + 12;

  // Verified Evidence Points (Agreed Ground)
  if (debate.juryVerdict.whatTheEvidenceEstablishes && debate.juryVerdict.whatTheEvidenceEstablishes.length > 0) {
    ensureSpace(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(6, 95, 70);
    doc.text('WHAT THE VERIFIED EVIDENCE ESTABLISHES (AGREED GROUND):', marginX, currentY);
    currentY += 12;

    debate.juryVerdict.whatTheEvidenceEstablishes.forEach((item) => {
      const cleanItem = cleanPdfText(item);
      const splitItem = doc.splitTextToSize(`- ${cleanItem}`, contentWidth - 12);
      ensureSpace(splitItem.length * 10 + 4);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(4, 120, 87);
      doc.text(splitItem, marginX + 8, currentY);
      currentY += splitItem.length * 10 + 3;
    });
    currentY += 8;
  }

  // Unsupported or Misleading Claims Exposed in Trial
  if (debate.juryVerdict.unsupportedOrMisleadingClaims && debate.juryVerdict.unsupportedOrMisleadingClaims.length > 0) {
    ensureSpace(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(185, 28, 28);
    doc.text('UNSUPPORTED OR MISLEADING CLAIMS EXPOSED IN TRIAL:', marginX, currentY);
    currentY += 12;

    debate.juryVerdict.unsupportedOrMisleadingClaims.forEach((item) => {
      const cleanItem = cleanPdfText(item);
      const splitItem = doc.splitTextToSize(`- ${cleanItem}`, contentWidth - 12);
      ensureSpace(splitItem.length * 10 + 4);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(185, 28, 28);
      doc.text(splitItem, marginX + 8, currentY);
      currentY += splitItem.length * 10 + 3;
    });
    currentY += 8;
  }

  // Downside Vulnerabilities (Points of Contention)
  if (debate.juryVerdict.uncertaintiesAndForecastingLimits && debate.juryVerdict.uncertaintiesAndForecastingLimits.length > 0) {
    ensureSpace(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(159, 18, 57);
    doc.text('DOWNSIDE VULNERABILITIES & UNCERTAINTIES (POINTS OF CONTENTION):', marginX, currentY);
    currentY += 12;

    debate.juryVerdict.uncertaintiesAndForecastingLimits.forEach((item) => {
      const cleanItem = cleanPdfText(item);
      const splitItem = doc.splitTextToSize(`- ${cleanItem}`, contentWidth - 12);
      ensureSpace(splitItem.length * 10 + 4);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(190, 18, 60);
      doc.text(splitItem, marginX + 8, currentY);
      currentY += splitItem.length * 10 + 3;
    });
    currentY += 10;
  }

  // Practical Indicators for Citizens to Monitor
  if (debate.juryVerdict.practicalCitizenTakeaways && debate.juryVerdict.practicalCitizenTakeaways.length > 0) {
    ensureSpace(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(21, 128, 61);
    doc.text('ACTIONABLE TAKEAWAYS & INDICATORS FOR CITIZENS TO MONITOR:', marginX, currentY);
    currentY += 12;

    debate.juryVerdict.practicalCitizenTakeaways.forEach((item) => {
      const cleanItem = cleanPdfText(item);
      const splitItem = doc.splitTextToSize(`- ${cleanItem}`, contentWidth - 12);
      ensureSpace(splitItem.length * 10 + 4);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(22, 101, 52);
      doc.text(splitItem, marginX + 8, currentY);
      currentY += splitItem.length * 10 + 3;
    });
    currentY += 8;
  }

  // Jargon Buster Concept Guide
  if (debate.juryVerdict.conceptGuide && debate.juryVerdict.conceptGuide.length > 0) {
    ensureSpace(60);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(120, 53, 15);
    doc.text('JARGON BUSTER: ECONOMIC & TECHNICAL CONCEPTS TRANSLATED:', marginX, currentY);
    currentY += 12;

    debate.juryVerdict.conceptGuide.forEach((concept) => {
      const cleanTerm = cleanPdfText(concept.term);
      const cleanDef = cleanPdfText(concept.plainDefinition);
      const cleanAnalogy = cleanPdfText(concept.everydayAnalogy);
      const conceptText = `${cleanTerm}: ${cleanDef} (Analogy: ${cleanAnalogy})`;
      const splitConcept = doc.splitTextToSize(conceptText, contentWidth - 16);
      const cardH = splitConcept.length * 10 + 8;

      ensureSpace(cardH + 4);

      doc.setFillColor(254, 243, 199);
      doc.setDrawColor(251, 191, 36);
      doc.roundedRect(marginX, currentY, contentWidth, cardH, 4, 4, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(146, 64, 14);
      doc.text(splitConcept, marginX + 8, currentY + 9);

      currentY += cardH + 6;
    });
    currentY += 8;
  }

  // ==========================================
  // CLAIMS VERIFICATION DOSSIER MATRIX
  // (All claims situated cleanly in their own dedicated dossier section)
  // ==========================================
  if (debate.claims && debate.claims.length > 0) {
    ensureSpace(60);

    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(245, 158, 11);
    doc.rect(marginX, currentY, contentWidth, 20, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(120, 53, 15);
    doc.text(`VERIFIED CLAIMS DOSSIER (${debate.claims.length} TESTED ARGUMENTS)`, marginX + 10, currentY + 14);

    currentY += 28;

    debate.claims.forEach((claim, idx) => {
      const cleanClaim = cleanPdfText(claim.text);
      const cleanExpl = cleanPdfText(claim.explanation);
      const cleanStatus = cleanPdfText(claim.verificationStatus).toUpperCase().replace(/_/g, ' ');
      const cleanSpeaker = cleanPdfText(claim.speakerName);
      const cleanType = cleanPdfText(claim.claimType).toUpperCase().replace(/_/g, ' ');

      const splitClaim = doc.splitTextToSize(`"${cleanClaim}"`, contentWidth - 24);
      const splitExpl = cleanExpl ? doc.splitTextToSize(cleanExpl, contentWidth - 24) : [];

      const hasOrig = Boolean(claim.originalArgument);
      const splitOrig = hasOrig
        ? doc.splitTextToSize(`Debater's Original Quote: "${cleanPdfText(claim.originalArgument!)}"`, contentWidth - 24)
        : [];

      const hasAudit = Boolean(claim.numericalVerification);
      const auditText = hasAudit
        ? `Numerical Audit: Claimed ${cleanPdfText(claim.numericalVerification!.claimedValue)} vs Verified ${cleanPdfText(claim.numericalVerification!.verifiedValue)} (${cleanPdfText(claim.numericalVerification!.unitOrScope)}) [${claim.numericalVerification!.isAccurate ? 'ACCURATE' : 'UNIT ERROR / MISLEADING'}]`
        : '';
      const splitAudit = hasAudit ? doc.splitTextToSize(auditText, contentWidth - 24) : [];

      const hasPassage = Boolean(claim.exactSupportingPassage);
      const splitPassage = hasPassage
        ? doc.splitTextToSize(`Source Proof Excerpt: "${cleanPdfText(claim.exactSupportingPassage!)}"`, contentWidth - 24)
        : [];

      const claimCardHeight =
        26 +
        splitClaim.length * 10 +
        (hasOrig ? splitOrig.length * 9 + 4 : 0) +
        (hasAudit ? splitAudit.length * 9 + 4 : 0) +
        (hasPassage ? splitPassage.length * 9 + 4 : 0) +
        (splitExpl.length > 0 ? splitExpl.length * 9 + 4 : 0) +
        12;

      ensureSpace(claimCardHeight);

      doc.setFillColor(255, 253, 249);
      doc.setDrawColor(229, 201, 166);
      doc.setLineWidth(1);
      doc.roundedRect(marginX, currentY, contentWidth, claimCardHeight, 5, 5, 'FD');

      let claimY = currentY + 13;

      // Header: Claim number, speaker & status
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(120, 53, 15);
      doc.text(`[CLAIM ${idx + 1}]  ${cleanSpeaker} (${cleanType})`, marginX + 12, claimY);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      const isVerified = cleanStatus.includes('VERIFIED');
      const isContradicted = cleanStatus.includes('CONTRADICTED');
      doc.setTextColor(isVerified ? 6 : isContradicted ? 185 : 159, isVerified ? 95 : isContradicted ? 28 : 18, isVerified ? 70 : isContradicted ? 28 : 57);
      doc.text(`[${cleanStatus}]`, pageWidth - marginX - 12, claimY, { align: 'right' });

      claimY += 12;

      // Claim quote
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(45, 24, 37);
      doc.text(splitClaim, marginX + 12, claimY);
      claimY += splitClaim.length * 10 + 4;

      // Original debater argument
      if (hasOrig && splitOrig.length > 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7);
        doc.setTextColor(180, 83, 9);
        doc.text(splitOrig, marginX + 12, claimY);
        claimY += splitOrig.length * 9 + 3;
      }

      // Numerical verification check
      if (hasAudit && splitAudit.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(claim.numericalVerification!.isAccurate ? 6 : 185, claim.numericalVerification!.isAccurate ? 95 : 28, claim.numericalVerification!.isAccurate ? 70 : 28);
        doc.text(splitAudit, marginX + 12, claimY);
        claimY += splitAudit.length * 9 + 3;
      }

      // Exact supporting passage
      if (hasPassage && splitPassage.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(3, 105, 161);
        doc.text(splitPassage, marginX + 12, claimY);
        claimY += splitPassage.length * 9 + 3;
      }

      // Explanation
      if (splitExpl.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(splitExpl, marginX + 12, claimY);
      }

      currentY += claimCardHeight + 8;
    });

    currentY += 8;
  }

  // ==========================================
  // COMPLETE COURT RECORD & EVIDENCE LEDGER
  // (All citations, source publishers, excerpts, and clickable URLs)
  // ==========================================
  ensureSpace(60);

  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(245, 158, 11);
  doc.rect(marginX, currentY, contentWidth, 20, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(120, 53, 15);
  doc.text(
    `COMPLETE EVIDENCE LEDGER (${debate.evidenceRecord.length} VERIFIED CITATIONS WITH LIVE SOURCE LINKS)`,
    marginX + 10,
    currentY + 14
  );

  currentY += 28;

  debate.evidenceRecord.forEach((item, index) => {
    const cleanTitle = cleanPdfText(item.title);
    const cleanSource = cleanPdfText(item.sourceName);
    const cleanSummary = cleanPdfText(item.summary);
    const cleanSnippet = cleanPdfText(item.exactSupportingPassage || item.quoteSnippet);

    const hasScope = Boolean(item.targetMetricOrUnit);
    const splitScope = hasScope
      ? doc.splitTextToSize(`Target Metric / Scope: ${cleanPdfText(item.targetMetricOrUnit!)}`, contentWidth - 24)
      : [];

    const splitSummary = doc.splitTextToSize(cleanSummary, contentWidth - 24);
    const splitQuote = cleanSnippet ? doc.splitTextToSize(`"${cleanSnippet}"`, contentWidth - 32) : [];

    const itemHeight =
      38 +
      (hasScope ? splitScope.length * 9 + 4 : 0) +
      splitSummary.length * 10 +
      (splitQuote.length > 0 ? splitQuote.length * 9 + 8 : 0);

    ensureSpace(itemHeight);

    doc.setFillColor(255, 253, 249);
    doc.setDrawColor(229, 201, 166);
    doc.setLineWidth(1);
    doc.roundedRect(marginX, currentY, contentWidth, itemHeight, 5, 5, 'FD');

    let itemY = currentY + 13;

    // Item Title & Reliability
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(120, 53, 15);
    doc.text(`[EXHIBIT ${index + 1}]  ${cleanTitle}`, marginX + 12, itemY);

    const reliabilityStr = cleanPdfText(item.reliability).toUpperCase().replace(/_/g, ' ');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(3, 105, 161);
    doc.text(`[${reliabilityStr}]`, pageWidth - marginX - 12, itemY, { align: 'right' });

    itemY += 12;

    // Source Name & Clickable URL
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(146, 64, 14);
    doc.text(`Source: ${cleanSource}`, marginX + 12, itemY);

    if (item.url && item.url.startsWith('http')) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(2, 132, 199);
      const urlText = cleanPdfText(item.url);
      const displayUrl = urlText.length > 45 ? urlText.slice(0, 42) + '...' : urlText;
      const linkText = `[Link: ${displayUrl}]`;
      const linkWidth = doc.getTextWidth(linkText);
      const linkX = pageWidth - marginX - 12 - linkWidth;
      doc.textWithLink(linkText, linkX, itemY, { url: item.url });
      doc.link(linkX, itemY - 7, linkWidth, 10, { url: item.url });
    }

    itemY += 12;

    // Target Metric / Scope
    if (hasScope && splitScope.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(180, 83, 9);
      doc.text(splitScope, marginX + 12, itemY);
      itemY += splitScope.length * 9 + 3;
    }

    // Summary Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(45, 24, 37);
    doc.text(splitSummary, marginX + 12, itemY);
    itemY += splitSummary.length * 10 + 4;

    // Quote / Supporting Passage Box
    if (splitQuote.length > 0) {
      const quoteBoxHeight = splitQuote.length * 9 + 8;
      doc.setFillColor(254, 243, 199);
      doc.setDrawColor(251, 191, 36);
      doc.roundedRect(marginX + 10, itemY, contentWidth - 20, quoteBoxHeight, 3, 3, 'FD');

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(120, 53, 15);
      doc.text(splitQuote, marginX + 14, itemY + 8);
    }

    currentY += itemHeight + 8;
  });

  // ==========================================
  // RUNNING FOOTER & PAGE NUMBERING ON ALL PAGES
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    doc.setDrawColor(229, 201, 166);
    doc.setLineWidth(0.8);
    doc.line(marginX, pageHeight - 26, pageWidth - marginX, pageHeight - 26);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 83, 56);
    doc.text('CrossCheck! - Visual Novel Courtroom Public Inquiry Platform', marginX, pageHeight - 15);

    doc.setFont('helvetica', 'bold');
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - marginX, pageHeight - 15, { align: 'right' });
  }

  // Trigger browser download
  const sanitizedTopic = cleanPdfText(debate.topic)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .slice(0, 36);
  doc.save(`CrossCheck_Court_Docket_${sanitizedTopic || 'trial_record'}.pdf`);
}
