import { PHILIPPINE_GDP_PRESET } from './presets';

/**
 * Intelligent topic extraction from raw debate text or discussion transcript.
 * Detects post titles, subjects, headers, or leading conversational premises.
 */
export function extractTopicFromText(text: string): string {
  if (!text || typeof text !== 'string') {
    return 'Submitted Debate Context';
  }

  const cleanText = text.trim();
  if (!cleanText) {
    return 'Submitted Debate Context';
  }

  // 1. Explicit post/title prefix pattern: Post: "...", Title: ..., Topic: ..., Subject: ...
  const explicitPrefixMatch = cleanText.match(
    /(?:^|\n)\s*(?:Post(?:\s*Title)?|Title|Topic|Subject|Headline|Case)\s*[:=-]\s*["'“]?([^"'\n\r”]+)["'”]?/i
  );
  if (explicitPrefixMatch && explicitPrefixMatch[1]?.trim()) {
    const extracted = explicitPrefixMatch[1].trim();
    if (extracted.length > 5) {
      return truncateTitle(extracted, 110);
    }
  }

  // 2. Markdown Header at the top (e.g. # Should AI Replace Junior Developers?)
  const headerMatch = cleanText.match(/(?:^|\n)\s*#+\s+([^\n\r]+)/);
  if (headerMatch && headerMatch[1]?.trim()) {
    const extracted = headerMatch[1].trim();
    if (extracted.length > 5) {
      return truncateTitle(extracted, 110);
    }
  }

  // 3. Scan first non-empty lines that aren't pure URLs or dividers
  const lines = cleanText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('http://') && !line.startsWith('https://') && !/^[-=_*#]{3,}$/.test(line));

  if (lines.length > 0) {
    let candidate = lines[0];

    // Strip leading speaker name if present (e.g., "Melon: ", "[Debater A]: ", "User_123 - ")
    candidate = candidate.replace(/^(?:\[[^\]]+\]|[A-Za-z0-9_ -]{2,20})\s*[:\-]\s*/, '').trim();

    // Strip wrapping quotes
    candidate = candidate.replace(/^["'“](.+)["'”]$/, '$1').trim();

    // If it's a question or statement, extract the first sentence
    const firstSentenceMatch = candidate.match(/^([^.?!]+[.?!])/);
    if (firstSentenceMatch && firstSentenceMatch[1].length >= 15) {
      candidate = firstSentenceMatch[1].trim();
    }

    if (candidate.length >= 10) {
      return truncateTitle(candidate, 100);
    }
  }

  return 'Submitted Debate Context';
}

/**
 * Resolves the accurate topic title for the deliberation screen and LangGraph pipeline.
 * Discards stale default preset hints when the user has input a new debate.
 */
export function resolveDebateTopic(text: string, customHint?: string): string {
  const trimmedHint = customHint?.trim() || '';
  const trimmedText = text?.trim() || '';

  // If text is the Philippine GDP preset, always use its canonical title
  if (
    trimmedText === PHILIPPINE_GDP_PRESET.rawText.trim() ||
    trimmedText.includes('the Philippine economy is projected to grow at an average annual rate of 5.8%')
  ) {
    return PHILIPPINE_GDP_PRESET.title;
  }

  // If the user entered a distinct custom topic hint (not the default preset title), honor it
  if (trimmedHint && trimmedHint !== PHILIPPINE_GDP_PRESET.title) {
    return trimmedHint;
  }

  // Otherwise, the hint is either blank or still holding the default seed preset title
  // Extract the topic directly from the user's submitted text!
  return extractTopicFromText(trimmedText);
}

function truncateTitle(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  const truncated = str.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 40 ? truncated.slice(0, lastSpace) : truncated) + '...';
}
