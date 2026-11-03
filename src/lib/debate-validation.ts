import type { DebateAnalysisResult } from '@/types/debate';

type RecordValue = Record<string, unknown>;

function object(value: unknown, path: string): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${path} must be an object.`);
  }
  return value as RecordValue;
}

function text(value: unknown, path: string) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${path} must be non-empty text.`);
}

function list(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${path} must be an array.`);
  return value;
}

function texts(value: unknown, path: string) {
  list(value, path).forEach((item, i) => text(item, `${path}[${i}]`));
}

function fields(value: RecordValue, names: string[], path: string) {
  names.forEach(name => text(value[name], `${path}.${name}`));
}

function choice(value: unknown, choices: readonly string[], path: string) {
  if (typeof value !== 'string' || !choices.includes(value)) throw new Error(`${path} has an unsupported value.`);
}

export function isSafeSourceUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password;
  } catch { return false; }
}

/** Validate at both external boundaries: AI responses and imported case files. */
export function parseDebateAnalysis(value: unknown): DebateAnalysisResult {
  const result = object(value, 'Case');
  fields(result, ['topic', 'contextSummary'], 'Case');
  for (const [key, id, role] of [['debaterA', 'debater_a', 'defense'], ['debaterB', 'debater_b', 'prosecution']]) {
    const profile = object(result[key], key);
    fields(profile, ['name', 'archetypeTitle', 'coreStance', 'accentColor'], key);
    choice(profile.id, [id], `${key}.id`);
    choice(profile.role, [role], `${key}.role`);
    if (profile.personalityTraits !== undefined) texts(profile.personalityTraits, `${key}.personalityTraits`);
    for (const name of ['catchphrase', 'speechStyle', 'bio']) {
      if (profile[name] !== undefined) text(profile[name], `${key}.${name}`);
    }
  }

  const evidence = list(result.evidenceRecord, 'evidenceRecord');
  const claims = list(result.claims, 'claims');
  const script = list(result.script, 'script');
  if (!script.length) throw new Error('script must contain at least one dialogue turn.');
  if (!claims.length) throw new Error('claims must contain at least one claim.');
  const collectIds = (items: unknown[], path: string) => {
    const ids = new Set<string>();
    items.forEach((item, i) => {
      const entry = object(item, `${path}[${i}]`);
      text(entry.id, `${path}[${i}].id`);
      if (ids.has(entry.id as string)) throw new Error(`${path} contains a duplicate id.`);
      ids.add(entry.id as string);
    });
    return ids;
  };
  const evidenceIds = collectIds(evidence, 'evidenceRecord');
  const claimIds = collectIds(claims, 'claims');
  collectIds(script, 'script');

  evidence.forEach((item, i) => {
    const entry = object(item, 'Evidence');
    fields(entry, ['title', 'sourceName', 'summary', 'relevanceToClaim'], `evidenceRecord[${i}]`);
    if (!isSafeSourceUrl(entry.url)) throw new Error(`evidenceRecord[${i}].url must be an HTTP or HTTPS source link.`);
    choice(entry.reliability, ['primary_source', 'official_report', 'news_media', 'expert_analysis'], 'Evidence reliability');
    for (const name of ['publicationDate', 'quoteSnippet']) {
      if (entry[name] !== undefined && typeof entry[name] !== 'string') throw new Error(`Evidence ${name} must be text.`);
    }
  });
  claims.forEach((item, i) => {
    const entry = object(item, 'Claim');
    fields(entry, ['speakerName', 'text', 'explanation'], `claims[${i}]`);
    choice(entry.speakerId, ['debater_a', 'debater_b'], 'Claim speaker');
    choice(entry.claimType, ['verifiable_statistic', 'historical_fact', 'forecast_prediction', 'value_judgment', 'interpretation'], 'Claim type');
    choice(entry.verificationStatus, ['verified', 'contradicted', 'unverified', 'mixed_or_conditional', 'opinion_not_testable'], 'Claim status');
    texts(entry.linkedEvidenceIds, 'Claim linkedEvidenceIds');
    for (const id of entry.linkedEvidenceIds as string[]) {
      if (!evidenceIds.has(id)) throw new Error(`Claim links to missing evidence: ${id}.`);
    }
    if (['verified', 'contradicted'].includes(entry.verificationStatus as string) && !(entry.linkedEvidenceIds as string[]).length) {
      throw new Error('Verified or contradicted claims must cite evidence.');
    }
  });
  script.forEach((item, i) => {
    const entry = object(item, 'Turn');
    fields(entry, ['speakerName', 'text'], `script[${i}]`);
    choice(entry.speakerId, ['debater_a', 'debater_b', 'jury'], 'Turn speaker');
    choice(entry.emotion, ['neutral', 'confident', 'thinking', 'intense', 'surprised', 'synthesis'], 'Turn emotion');
    if (entry.callout != null) choice(entry.callout, ['OBJECTION!', 'HOLD IT!', 'TAKE THAT!', 'POINT OF ORDER'], 'Turn callout');
    if (entry.activeClaimId !== undefined && !claimIds.has(entry.activeClaimId as string)) throw new Error('Turn links to a missing claim.');
    if (entry.presentedEvidenceId !== undefined && !evidenceIds.has(entry.presentedEvidenceId as string)) throw new Error('Turn links to missing evidence.');
  });
  const jury = object(result.juryVerdict, 'juryVerdict');
  fields(jury, ['topicTitle', 'coreDisagreementSummary', 'educationalTakeaway', 'balancedVerdict'], 'juryVerdict');
  texts(jury.whatTheEvidenceEstablishes, 'whatTheEvidenceEstablishes');
  texts(jury.uncertaintiesAndForecastingLimits, 'uncertaintiesAndForecastingLimits');
  list(jury.conceptGuide, 'conceptGuide').forEach((item, i) => {
    fields(object(item, 'Concept'), ['term', 'plainDefinition', 'everydayAnalogy', 'contextInDebate'], `conceptGuide[${i}]`);
  });
  // Imported files cannot assert that this server performed a live search.
  return { ...result, research: { mode: 'imported', summary: 'Imported case. Sources and verification labels were supplied by its author; no live research was performed on import.' } } as unknown as DebateAnalysisResult;
}
