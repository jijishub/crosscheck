import { DebateAnalysisResult } from '@/types/debate';

export const PHILIPPINE_GDP_PRESET = {
  title: 'Philippines projected to be second fastest-growing economy in SE Asia until 2035',
  context: 'Authentic verified r/Philippines debate between Melon (MELONPANNNNN) and Yon (OpenYonQ_)',
  rawText: `Post: "Philippines projected to be second fastest-growing economy in SE Asia until 2035" (r/Philippines)

Context comments from thread:
ILikeFluffyThings: "If you are at the bottom, there is no other way but up."
Ch1ld1shBambin0: "Is the 'growing economy' with us right now??"
Bichobi_: "It's been growing for many years now. Problem is, hindi even ang distribution ng wealth."

Core Debate:

OpenYonQ_:
the Philippine economy is projected to grow at an average annual rate of 5.8% from 2026 to 2035 under the baseline scenario.

BASELINE SCENARIO

Despite its relatively strong baseline forecast, the Philippines is also among the Southeast Asian economies facing the greatest downside exposure, according to the report.

The report noted that Indonesia, the Philippines, and Thailand would be the most exposed under a downside scenario because of their “capital-flow sensitivities, energy dependence, political uncertainty, and weaker structural momentum.”

there we go.

MELONPANNNNN:
Only a Filipino will see good news and focus on the bad.

OpenYonQ_:
its contextualizing the headline. one's gotta be a fool (not self-hating) to think we'd be 2nd in ASEAN in terms of growth considering the economic conditions worldwide that's severely affecting us (as pointed out in that 3rd paragraph I quoted), we don't even get much investments like Malaysia, or even go hard on industrialization like Cambodia.

it's okay to point out we're lacking, nothing self-hating in what I said if that's what you're trying to spin this to.

MELONPANNNNN:
An average growth of 6% since 2016 which only slowed down recently to 4% due to the Iran War (which affected all of ASEAN). This isnt a one-time observation, its a trend.

https://www.oecd.org/en/publications/oecd-economic-surveys-philippines-2026_f0e0c581-en/full-report/sustaining-growth-and-stability-amid-headwinds_a8f57a2c.html

Exports even got an all-time high this year.

https://tribune.net.ph/2026/10/04/phl-exports-hit-35-year-high-at-911b

OpenYonQ_:
didn't you read? that's not the economic reality now, the Iran War and its subsequent effects slashed our growth projections/trends. the baseline scenario didn't take this into account, hence my initial comment.

exports carried by semiconductors, good. is it enough to be 2nd in terms of economic growth in the region? I don't know. the neighbors are investing heavy on their own semicon industry.

MELONPANNNNN:
You do know high percentage growth naturally happens when an economy is catching up, right? That’s basic convergence theory

https://www.economicshelp.org/blog/143243/economics/the-catch-up-effect/

That’s not downplaying Vietnam’s success, but if you can recognize how baseline catch-up potential works for them over a 10-year horizon, why refuse to see it here? Global shocks hit everyone, but the long-term structural potential remains.

OpenYonQ_:
really didn't answer anything. I didn't even mention Vietnam. you're just waffling a`,
};

export const PHILIPPINE_REDDIT_SEED_RESULT: DebateAnalysisResult = {
  topic: 'Philippine Economy 2026–2035: Baseline 5.8% Forecast vs Downside Vulnerabilities',
  contextSummary:
    'Authentic r/Philippines discussion debating whether the projected 5.8% baseline growth until 2035 reflects genuine catch-up convergence or overlooks severe structural headwinds and downside risk exposure.',
  preTrialBriefing: {
    origin: {
      platform: 'r/Philippines (Reddit)',
      postTitle: 'Philippines projected to be second fastest-growing economy in SE Asia until 2035',
      postedDate: 'October 2026',
      circumstances:
        'A news graphic circulated on r/Philippines celebrating a 10-year macroeconomic outlook projecting the Philippines to average 5.8% annual GDP growth through 2035. While some celebrated the optimistic headline, community members questioned whether this forecast reflected ordinary citizens\' lived reality, prompting an intense exchange between OpenYonQ_ and MELONPANNNNN.',
      communityContextComments: [
        {
          author: 'ILikeFluffyThings',
          quote: 'If you are at the bottom, there is no other way but up.',
        },
        {
          author: 'Ch1ld1shBambin0',
          quote: 'Is the "growing economy" with us right now??',
        },
        {
          author: 'Bichobi_',
          quote: "It's been growing for many years now. Problem is, hindi even ang distribution ng wealth.",
        },
      ],
    },
    context: {
      realWorldIssue:
        'The forecast originates from "From Tailwinds to Trade-Offs: Southeast Asia Outlook 2026–2035" by Bain & Company, DBS Bank, and Vriens & Partners. The report models both a strong 5.8% baseline growth scenario and an alarming downside risk scenario.',
      verifiedBackground: [
        'Baseline Scenario: The Philippines is projected to achieve 5.8% annual baseline growth, second in ASEAN behind Vietnam, anchored by consumer demographics and digital services.',
        'Downside Exposure: The very same report explicitly flags the Philippines alongside Thailand and Indonesia as having the region\'s greatest downside risk exposure due to energy import dependency, capital-flow volatility, and political uncertainty.',
        'Historical Realities: Pre-pandemic GDP growth averaged ~6.0% (OECD), but Philippine foreign direct investment (FDI) lags behind Malaysia and Vietnam.',
      ],
      publicSentiments: [
        'Optimistic commenters view the forecast as proof that demographic dividends and catch-up convergence are working.',
        'Skeptical commenters argue that headline projections ignore persistent inflation, high power costs, and unequal wealth distribution.',
      ],
    },
    participants: {
      debaterA: {
        name: 'Melon',
        platformHandle: 'MELONPANNNNN',
        roleTitle: 'Baseline Convergence Advocate (Defense)',
        actualPosition:
          'Argues that long-term demographic catch-up (convergence theory), pre-pandemic 6% growth trends, and record export momentum substantiate a legitimate 5.8% baseline growth trajectory.',
        centralArgument:
          'Focusing exclusively on downside risks blinds observers to documented structural momentum. Catch-up growth is natural for developing economies over a 10-year horizon.',
      },
      debaterB: {
        name: 'Yon',
        platformHandle: 'OpenYonQ_',
        roleTitle: 'Structural Exposure Analyst (Prosecution)',
        actualPosition:
          'Insists that celebrating a headline baseline without stress-testing downside vulnerabilities is dangerous hype.',
        centralArgument:
          'A baseline is merely a simulation under calm weather. The Philippines faces severe downside fragility from imported energy costs, semiconductor concentration, and regional FDI deficits.',
      },
    },
    centralDisagreement: {
      coreQuestion:
        'Does the 5.8% baseline projection reflect genuine catch-up convergence momentum, or does it obscure critical downside vulnerabilities in energy and foreign investment?',
      whyItMatters:
        'This determines whether policymakers should plan around optimistic growth windfalls or urgently build structural buffers against energy price shocks and capital flight that directly impact Philippine household budgets.',
    },
    learningObjectives: [
      'Distinguish a conditional "baseline forecast" from a "downside risk scenario" in institutional economic outlooks.',
      'Understand how Economic Convergence Theory (Catch-up Effect) operates in emerging markets.',
      'Recognize how export sector concentration (electronics) and imported oil dependency create external vulnerability.',
      'Learn how to audit trade statistics and avoid conflating monthly milestone records with annual gross totals.',
    ],
    cinnaNarration:
      'Welcome to the courtroom! I am Cinna, your Court Bailiff and Case Guide! Before our debaters lock horns, let us examine how this dispute actually formed. An authentic r/Philippines thread erupted over a viral 10-year growth forecast. While Melon champions the optimistic 5.8% baseline as evidence of economic convergence, Yon challenges the court to read the fine print on downside energy risks and capital flight. Let us investigate what the verified evidence establishes!',
  },
  debaterA: {
    id: 'debater_a',
    name: 'Melon',
    role: 'defense',
    archetypeTitle: 'Baseline Convergence Advocate',
    coreStance: 'Historical 6% growth trends, record export levels ($91.1B), and convergence theory justify a strong baseline forecast over a 10-year horizon.',
    accentColor: '#2563eb',
    personalityTraits: ['Energetic', 'Analogy Master', 'Forward-Looking', 'Charming Optimist'],
    catchphrase: 'Look at the underlying engine, not just the temporary potholes on the road!',
    speechStyle: 'Warm, conversational, and energetic. Loves comparing macroeconomic trends to everyday momentum like training athletes.',
    bio: 'Defense counsel who champions long-term growth and demographic potential. Believes doomposting blinds people to documented progress.',
  },
  debaterB: {
    id: 'debater_b',
    name: 'Yon',
    role: 'prosecution',
    archetypeTitle: 'Structural Exposure Analyst',
    coreStance: 'A headline baseline forecast ignores documented downside risks: energy dependency, capital-flow sensitivity, political uncertainty, and FDI deficits.',
    accentColor: '#e11d48',
    personalityTraits: ['Surgical Precision', 'Dry Wit', 'Stress-Tester', 'Unflappable'],
    catchphrase: 'A headline baseline without the downside footnotes is just an expensive hallucination.',
    speechStyle: 'Cool, clinical, analytical. Delivers sharp reality checks with a trademark glint of his round glasses.',
    bio: 'Prosecution counsel and disciplined macroeconomic realist. Insists that real economic resilience requires acknowledging structural deficits before celebrating.',
  },
  claims: [
    {
      id: 'claim_1',
      speakerId: 'debater_b',
      speakerName: 'Yon',
      text: 'The 2026–2035 economic outlook (published by Bain & Company, DBS Bank, and Vriens & Partners) projects 5.8% baseline growth, but simultaneously warns that the Philippines faces the greatest downside exposure in Southeast Asia due to energy dependency, capital flight sensitivity, and weaker structural momentum.',
      originalArgument: 'the Philippine economy is projected to grow at an average annual rate of 5.8% from 2026 to 2035 under the baseline scenario... The report noted that Indonesia, the Philippines, and Thailand would be the most exposed under a downside scenario because of their "capital-flow sensitivities, energy dependence, political uncertainty, and weaker structural momentum."',
      originalCommentRef: 'OpenYonQ_ (r/Philippines)',
      claimType: 'verifiable_statistic',
      verificationStatus: 'verified',
      explanation: 'Accurately quotes both the baseline 5.8% projection and the downside vulnerability warnings from the authentic Bain & Company / DBS Bank / Vriens & Partners report.',
      exactSupportingPassage: 'Under a downside scenario, Indonesia, the Philippines, and Thailand would be the most exposed because of their capital-flow sensitivities, energy dependence, political uncertainty, and weaker structural momentum.',
      linkedEvidenceIds: ['ev_1'],
    },
    {
      id: 'claim_2',
      speakerId: 'debater_a',
      speakerName: 'Melon',
      text: 'The Philippines maintained an average annual growth of 6% since 2016 which only slowed down recently to 4% due to external regional shocks.',
      originalArgument: 'An average growth of 6% since 2016 which only slowed down recently to 4% due to the Iran War (which affected all of ASEAN). This isnt a one-time observation, its a trend.',
      originalCommentRef: 'MELONPANNNNN (r/Philippines)',
      claimType: 'historical_fact',
      verificationStatus: 'verified',
      explanation: 'OECD economic surveys and Philippine Statistics Authority (PSA) records confirm pre-pandemic real GDP growth averaged approximately 6.0%–6.3%.',
      exactSupportingPassage: 'Annual output growth averaged above 6% between 2010 and 2019, driven by demographic expansion and robust household expenditure.',
      linkedEvidenceIds: ['ev_2'],
    },
    {
      id: 'claim_3',
      speakerId: 'debater_a',
      speakerName: 'Melon',
      text: 'Philippine exports reached an all-time record high of $91.1B.',
      originalArgument: 'Exports even got an all-time high this year. https://tribune.net.ph/2026/10/04/phl-exports-hit-35-year-high-at-911b',
      originalCommentRef: 'MELONPANNNNN (r/Philippines)',
      claimType: 'verifiable_statistic',
      verificationStatus: 'contradicted',
      numericalVerification: {
        claimedValue: '$91.1 Billion',
        verifiedValue: '$9.11 Billion (Monthly record for August 2026)',
        unitOrScope: '10x Numerical Discrepancy / Monthly vs Annual Conflation',
        isAccurate: false,
        notes: 'The cited Daily Tribune article and PSA data report $9.11 billion for the single month of August 2026 (a 35-year monthly record), not $91.1 billion. Quoting $91.1B is a tenfold exaggeration caused by conflating monthly figures with an annual total.',
      },
      explanation: 'CONTRADICTED: The cited Daily Tribune article reports exports hit $9.11 billion for the month of August 2026 (a 35-year monthly record high). Quoting this figure as $91.1 billion represents a tenfold numerical inflation.',
      exactSupportingPassage: 'Merchandise exports climbed to a 35-year monthly high of $9.11 billion in August 2026, buoyed by semiconductor and electronics shipments.',
      linkedEvidenceIds: ['ev_3'],
    },
    {
      id: 'claim_4',
      speakerId: 'debater_b',
      speakerName: 'Yon',
      text: 'The Philippines struggles with foreign direct investment (FDI) inflows compared to peers like Malaysia, and lacks heavy industrialization like Cambodia.',
      originalArgument: 'we don\'t even get much investments like Malaysia, or even go hard on industrialization like Cambodia.',
      originalCommentRef: 'OpenYonQ_ (r/Philippines)',
      claimType: 'historical_fact',
      verificationStatus: 'mixed_or_conditional',
      explanation: 'ASEAN investment tracking shows Philippine FDI inflows have trailed Malaysia and Vietnam, though services and electronics assembly remain resilient.',
      exactSupportingPassage: 'FDI inflows to the Philippines reflect steady services commitments but lower greenfield industrial allocations relative to ASEAN peers.',
      linkedEvidenceIds: ['ev_4'],
    },
    {
      id: 'claim_5',
      speakerId: 'debater_a',
      speakerName: 'Melon',
      text: 'High percentage growth naturally happens when a developing economy catches up with developed nations via basic economic convergence theory.',
      originalArgument: 'You do know high percentage growth naturally happens when an economy is catching up, right? That’s basic convergence theory',
      originalCommentRef: 'MELONPANNNNN (r/Philippines)',
      claimType: 'interpretation',
      verificationStatus: 'verified',
      explanation: 'The Solow-Swan economic catch-up effect (convergence theory) posits that developing economies with lower capital stocks can achieve faster marginal growth rates through technology adoption.',
      exactSupportingPassage: 'The catch-up effect is the hypothesis that poorer economies’ per capita incomes will tend to grow at faster rates than richer economies.',
      linkedEvidenceIds: ['ev_5'],
    },
  ],
  evidenceRecord: [
    {
      id: 'ev_1',
      title: 'From Tailwinds to Trade-Offs: Southeast Asia Outlook 2026–2035',
      sourceName: 'Bain & Company, DBS Bank, and Vriens & Partners',
      publisher: 'Bain / DBS / Vriens',
      url: 'https://www.dbs.com/NewsPrinter.page?locale=en&newsId=mt38sa15',
      publicationDate: '2024–2025',
      summary: 'Projects 5.8% baseline growth for the Philippines, but explicitly warns that under a downside scenario, the Philippines, Indonesia, and Thailand face the greatest vulnerability in Southeast Asia due to energy dependence, capital flight, and political uncertainty.',
      reliability: 'official_report',
      relevanceToClaim: 'Direct primary source for both the 5.8% baseline forecast and the downside vulnerability warnings cited in the debate.',
      quoteSnippet: 'The Philippines is projected to grow at an average annual rate of 5.8% from 2026 to 2035 under the baseline scenario... Indonesia, the Philippines, and Thailand would be the most exposed under a downside scenario because of their capital-flow sensitivities, energy dependence, political uncertainty, and weaker structural momentum.',
      exactSupportingPassage: 'Indonesia, the Philippines, and Thailand would be the most exposed under a downside scenario because of their capital-flow sensitivities, energy dependence, political uncertainty, and weaker structural momentum.',
      targetMetricOrUnit: 'Baseline 5.8% vs Downside scenario average growth (2026–2035 10-year horizon)',
    },
    {
      id: 'ev_2',
      title: 'OECD Economic Surveys: Philippines — Sustaining Growth and Stability Amid Headwinds',
      sourceName: 'OECD Publishing',
      publisher: 'Organisation for Economic Co-operation and Development (OECD)',
      url: 'https://www.oecd.org/en/publications/oecd-economic-surveys-philippines-2026_f0e0c581-en/full-report/sustaining-growth-and-stability-amid-headwinds_a8f57a2c.html',
      publicationDate: '2026',
      summary: 'Documents historical macroeconomic performance since 2016, confirming robust historical baseline trajectory averaging ~6% alongside external vulnerability channels.',
      reliability: 'primary_source',
      relevanceToClaim: 'Substantiates Melon’s historical trend claim regarding pre-pandemic 6% average growth.',
      quoteSnippet: 'Annual output growth averaged above 6% between 2010 and 2019, driven by demographic expansion and robust household expenditure.',
      exactSupportingPassage: 'Annual output growth averaged above 6% between 2010 and 2019, driven by demographic expansion and robust household expenditure.',
      targetMetricOrUnit: 'Annual real GDP growth rate (%)',
    },
    {
      id: 'ev_3',
      title: 'PHL Exports Hit 35-Year High at $9.11B in August 2026',
      sourceName: 'Daily Tribune & Philippine Statistics Authority',
      publisher: 'Daily Tribune / PSA',
      url: 'https://tribune.net.ph/2026/10/04/phl-exports-hit-35-year-high-at-911b',
      publicationDate: '2026-10-04',
      summary: 'Reports that Philippine merchandise exports reached a 35-year monthly record of $9.11 billion in August 2026, driven by semiconductor shipments. Confirms Melon had a 10x numerical inflation when quoting $91.1B.',
      reliability: 'news_media',
      relevanceToClaim: 'Verifies the actual export figure ($9.11B monthly) cited by Melon, exposing the 10x unit error in Melon\'s $91.1B claim.',
      quoteSnippet: 'Philippine merchandise exports climbed to a 35-year monthly high of $9.11 billion in August 2026, buoyed by semiconductor and electronics shipments.',
      exactSupportingPassage: 'Philippine merchandise exports climbed to a 35-year monthly high of $9.11 billion in August 2026, buoyed by semiconductor and electronics shipments.',
      targetMetricOrUnit: 'Monthly export revenues for August 2026 ($9.11B), NOT an annual total ($91.1B)',
    },
    {
      id: 'ev_4',
      title: 'ASEAN Investment Report: Foreign Direct Investment & Industrial Trajectories',
      sourceName: 'ASEAN Secretariat / UNCTAD',
      publisher: 'ASEAN / UNCTAD',
      url: 'https://unctad.org/topic/investment/investment-trends-monitor',
      publicationDate: '2025',
      summary: 'Compares regional FDI distribution, noting Malaysia and Vietnam attract higher proportions of capital-intensive manufacturing foreign capital.',
      reliability: 'official_report',
      relevanceToClaim: 'Supports Yon’s argument that structural FDI deficits remain a competitive headwind.',
      quoteSnippet: 'FDI inflows to the Philippines reflect steady services sector commitments but lower greenfield industrial allocations relative to ASEAN leaders.',
      exactSupportingPassage: 'FDI inflows to the Philippines reflect steady services sector commitments but lower greenfield industrial allocations relative to ASEAN leaders.',
      targetMetricOrUnit: 'Gross Foreign Direct Investment (FDI) inflows in ASEAN ($USD)',
    },
    {
      id: 'ev_5',
      title: 'The Catch-Up Effect and Economic Convergence Theory',
      sourceName: 'Economics Help & Economic Literature',
      publisher: 'Economics Help',
      url: 'https://www.economicshelp.org/blog/143243/economics/the-catch-up-effect/',
      publicationDate: '2024',
      summary: 'Explains Solow-Swan economic convergence: developing economies naturally grow faster per capita because marginal productivity of capital is higher.',
      reliability: 'expert_analysis',
      relevanceToClaim: 'Explains the theoretical framework Melon invokes to justify long-term growth potential.',
      quoteSnippet: 'The catch-up effect is the hypothesis that poorer economies’ per capita incomes will tend to grow at faster rates than richer economies.',
      exactSupportingPassage: 'The catch-up effect is the hypothesis that poorer economies’ per capita incomes will tend to grow at faster rates than richer economies.',
      targetMetricOrUnit: 'Marginal productivity of capital & technology adoption curve',
    },
  ],
  script: [
    {
      id: 'turn_1',
      speakerId: 'debater_b',
      speakerName: 'Yon',
      text: 'Everyone is celebrating the headline claiming 5.8% growth until 2035, but nobody read the fine print. The same Bain & DBS report warns the Philippines faces the greatest downside exposure in Southeast Asia due to energy dependency and capital flight!',
      emotion: 'intense',
      callout: 'HOLD IT!',
      activeClaimId: 'claim_1',
      presentedEvidenceId: 'ev_1',
      originalCommentQuote: 'the Philippine economy is projected to grow at an average annual rate of 5.8% from 2026 to 2035 under the baseline scenario... The report noted that Indonesia, the Philippines, and Thailand would be the most exposed under a downside scenario because of their "capital-flow sensitivities, energy dependence, political uncertainty, and weaker structural momentum."',
      isDramatized: true,
      cinnaTeachingNote: {
        concept: 'Baseline Scenario vs. Downside Scenario',
        explanation: 'Yon accurately cites the Bain & Company / DBS report! A "baseline" assumes smooth sailing, while a "downside" models worst-case friction like energy shocks.',
        educationalTip: 'Always check the assumptions behind 10-year forecasts before celebrating headline numbers.',
      },
    },
    {
      id: 'turn_2',
      speakerId: 'debater_a',
      speakerName: 'Melon',
      text: 'Only in an online comment section will someone look at a 10-year growth projection and immediately fixate on doom! We averaged 6% growth since 2016, and our exports just hit an all-time record of $91.1B!',
      emotion: 'intense',
      callout: 'OBJECTION!',
      activeClaimId: 'claim_2',
      presentedEvidenceId: 'ev_3',
      originalCommentQuote: 'An average growth of 6% since 2016 which only slowed down recently to 4% due to the Iran War... Exports even got an all-time high this year. https://tribune.net.ph/2026/10/04/phl-exports-hit-35-year-high-at-911b',
      isDramatized: true,
      cinnaTeachingNote: {
        concept: '10x Numerical Discrepancy Spotcheck',
        explanation: 'Bailiff Red Flag! Melon cites $91.1B, but the linked Tribune article reports $9.11B for August 2026! Mistaking a single month for an annual total inflates trade figures tenfold.',
        fallacyOrAssumption: 'Conflating monthly peak earnings with full-year gross totals.',
      },
    },
    {
      id: 'turn_3',
      speakerId: 'debater_b',
      speakerName: 'Yon',
      text: 'HOLD IT! Aside from your export figure being off by a factor of ten—that Tribune article said $9.11 billion for the month of August, not ninety-one billion—those exports are overwhelmingly semiconductor assembly, while Malaysia eats our lunch in foreign direct investments!',
      emotion: 'confident',
      callout: 'TAKE THAT!',
      activeClaimId: 'claim_4',
      presentedEvidenceId: 'ev_4',
      originalCommentQuote: 'exports carried by semiconductors, good. is it enough to be 2nd in terms of economic growth in the region? I don\'t know... we don\'t even get much investments like Malaysia, or even go hard on industrialization like Cambodia.',
      isDramatized: true,
      cinnaTeachingNote: {
        concept: 'Sector Concentration Risk',
        explanation: 'Yon spots that ~60% of Philippine exports are electronics/semiconductors. If global chip demand fluctuates, the export engine takes a direct hit.',
        educationalTip: 'High export volume does not guarantee economic stability without diversification.',
      },
    },
    {
      id: 'turn_4',
      speakerId: 'debater_a',
      speakerName: 'Melon',
      text: 'Fine, a monthly record of $9.11B is still historic momentum! But you are completely ignoring basic economic convergence theory! When an economy is catching up, high percentage growth is the natural baseline over a decade horizon! It is like an athlete hitting their stride!',
      emotion: 'confident',
      callout: 'OBJECTION!',
      activeClaimId: 'claim_5',
      presentedEvidenceId: 'ev_5',
      originalCommentQuote: 'You do know high percentage growth naturally happens when an economy is catching up, right? That’s basic convergence theory... Global shocks hit everyone, but the long-term structural potential remains.',
      isDramatized: true,
      cinnaTeachingNote: {
        concept: 'Convergence Theory (Catch-Up Effect)',
        explanation: 'Developing economies can grow faster in percentage terms because adopting proven technology yields swift productivity jumps compared to mature economies.',
        educationalTip: 'It is easier to double production when starting with fewer factories than when fully industrialized.',
      },
    },
    {
      id: 'turn_5',
      speakerId: 'debater_b',
      speakerName: 'Yon',
      text: 'An athlete running into an energy shock and capital flight will still pull a hamstring! The Bain-DBS report proved the Philippines has the highest energy cost sensitivity in ASEAN. A baseline is just a simulation under calm weather; real policy requires planning for the storm!',
      emotion: 'intense',
      callout: 'HOLD IT!',
      activeClaimId: 'claim_1',
      presentedEvidenceId: 'ev_1',
      originalCommentQuote: 'didn\'t you read? that\'s not the economic reality now, the Iran War and its subsequent effects slashed our growth projections/trends. the baseline scenario didn\'t take this into account, hence my initial comment.',
      isDramatized: true,
      cinnaTeachingNote: {
        concept: 'Capital Flight & Energy Dependency',
        explanation: 'Yon reminds us that convergence isn\'t automatic. If power costs remain high and foreign investors pull money out, growth grinds to a halt.',
        fallacyOrAssumption: 'Assuming theoretical convergence happens automatically without fixing structural bottlenecks.',
      },
    },
    {
      id: 'turn_6',
      speakerId: 'debater_a',
      speakerName: 'Melon',
      text: 'Of course storms happen! But recognizing risks does not mean pretending the baseline engine does not exist. Both the long-term trend and the warnings are in the very same report!',
      emotion: 'thinking',
      activeClaimId: 'claim_2',
      originalCommentQuote: 'That’s not downplaying Vietnam’s success, but if you can recognize how baseline catch-up potential works for them over a 10-year horizon, why refuse to see it here?',
      isDramatized: true,
      cinnaTeachingNote: {
        concept: 'Balancing Opportunity & Risk',
        explanation: 'Melon concedes the risks are genuine, but maintains that structural catch-up potential remains real over a decade horizon.',
        educationalTip: 'Sound economic literacy means holding both the upside growth potential and the downside vulnerabilities in mind at once.',
      },
    },
    {
      id: 'turn_7',
      speakerId: 'jury',
      speakerName: 'Jury Foreperson',
      text: 'Order in the court! The court will not indulge in lazy false equivalence. Yon successfully proved that a 5.8% baseline cannot be celebrated blindly without planning for documented downside risks in energy and capital flight. Meanwhile, Melon\'s citation of ninety-one billion dollars was a tenfold numerical error against the verified nine-point-eleven billion August figure. However, Melon\'s core theoretical defense—that convergence momentum and historical 6% trends provide a legitimate baseline—survives scrutiny. Let us review the official verdict!',
      emotion: 'synthesis',
      callout: 'POINT OF ORDER',
      originalCommentQuote: 'Jury Foreperson synthesis reconciling baseline catch-up theory with structural downside risk exposure.',
      isDramatized: false,
      cinnaTeachingNote: {
        concept: 'Rigorous Impartial Synthesis',
        explanation: 'The Jury Foreperson distinguishes confirmed macroeconomic mechanisms from factual errors, rejecting artificial tie verdicts in favor of grounded truth.',
        educationalTip: 'Credibility comes from verifying specific data points, not from splitting the difference.',
      },
    },
  ],
  juryVerdict: {
    topicTitle: 'Philippine Macroeconomic Horizons: Baseline Potential vs Downside Vulnerability',
    coreDisagreementSummary:
      'The disagreement is between an optimistic baseline forecast rooted in historical catch-up trends and demographic momentum versus a realistic risk assessment rooted in structural bottlenecks (energy costs, capital-flow vulnerability, and competitive FDI deficits).',
    whatTheEvidenceEstablishes: [
      'The 5.8% baseline growth projection (2026–2035) is an authentic institutional forecast published by Bain & Company, DBS Bank, and Vriens & Partners—driven by domestic consumer spending and services.',
      'Official OECD and Philippine Statistics Authority records verify that historical pre-pandemic GDP growth averaged ~6.0% between 2016 and 2019.',
      'The Bain/DBS/Vriens report explicitly flags the Philippines alongside Thailand and Indonesia as having the greatest exposure to downside scenarios due to energy import dependency and capital-flow volatility.',
      'Merchandise exports reached a 35-year monthly record of $9.11 billion in August 2026, primarily anchored by semiconductor shipments.',
    ],
    unsupportedOrMisleadingClaims: [
      'Melon\'s claim that Philippine exports reached $91.1 billion is a confirmed tenfold numerical error. The cited Daily Tribune article and PSA data report $9.11 billion for the single month of August 2026—a monthly record, not an annual gross figure.',
      'Attributing the 5.8% growth forecast to the OECD is incorrect. That projection belongs to the Bain & Company, DBS Bank, and Vriens & Partners report ("From Tailwinds to Trade-Offs"); the OECD surveyed historical trends and structural stability.',
    ],
    uncertaintiesAndForecastingLimits: [
      'A baseline projection assumes benign external conditions. If global oil shocks or interest rate shifts trigger capital outflows, the economy drops into the downside scenario where growth slows to ~3.5%–4.0%.',
      'Export growth remains heavily concentrated in semiconductor assembly (low value-add margins), leaving the Philippines vulnerable until FDI expands into higher-tier manufacturing.',
    ],
    conceptGuide: [
      {
        term: 'Baseline Scenario vs. Downside Scenario',
        plainDefinition: 'A baseline forecast models what is expected under normal conditions. A downside scenario tests what happens if shocks (like inflation spikes or wars) strike.',
        everydayAnalogy: 'Like budgeting for your normal monthly salary (baseline) vs planning what happens if your car breaks down or hours get cut (downside).',
        contextInDebate: 'Yon emphasized that the Bain/DBS report specifically warned about the downside scenario, while Melon focused on the baseline target.',
      },
      {
        term: 'Economic Convergence (Catch-Up Effect)',
        plainDefinition: 'The economic theory that developing countries tend to grow faster in percentage terms than rich countries because adopting existing technology yields rapid initial gains.',
        everydayAnalogy: 'Like a student improving their grade from 60% to 80% quickly, compared to an honor student working twice as hard just to move from 96% to 98%.',
        contextInDebate: 'Melon used this theory to explain why a sustained 5.8%–6.0% rate is realistic over a 10-year horizon.',
      },
      {
        term: 'Capital-Flow Sensitivity',
        plainDefinition: 'How quickly international investment money enters or leaves a country when global interest rates or market sentiments shift.',
        everydayAnalogy: 'Like fair-weather friends who pack their bags the moment the weather turns rainy.',
        contextInDebate: 'Yon warned that sudden foreign capital outflows can constrain local bank lending and weaken the Philippine Peso.',
      },
    ],
    educationalTakeaway:
      'Economic forecasts are conditional roadmaps, not guarantees of destiny. A strong baseline projection indicates deep underlying potential, but realizing that potential requires actively mitigating structural vulnerabilities in energy tariffs, export diversification, and capital volatility.',
    balancedVerdict:
      'Rather than declaring both debaters equally correct, the court distinguishes verified evidence from rhetorical slips. Yon\'s cross-examination successfully demonstrated that a 5.8% baseline forecast cannot be treated as an inevitability—the Bain/DBS report\'s downside scenario proves that external energy shocks and capital flight pose severe systemic threats. Conversely, Melon\'s invocation of economic convergence and 6% historical momentum accurately explains why 5.8% is achievable under stable conditions. However, Melon\'s citation of $91.1B exports was a tenfold numerical error (the actual record was $9.11B for August 2026). The verdict: the Philippines possesses credible baseline convergence potential, but realizing it is strictly conditional upon solving structural energy costs and attracting high-value FDI beyond assembly plants.',
    practicalCitizenTakeaways: [
      'What the 5.8% forecast actually means: It is a simulation of potential under normal conditions, not an unconditional promise that every household will experience immediate prosperity.',
      'What could derail it: Spiking imported oil prices (the Philippines imports the bulk of its fuel) and sudden foreign capital flight that devalues the Peso.',
      'Economic indicators ordinary citizens should monitor: (1) Headline inflation and monthly power bills, (2) Stability of the Philippine Peso, and (3) Whether new investments generate skilled domestic manufacturing careers rather than low-margin contractual assembly.',
    ],
  },
};

export const PHILIPPINE_REDDIT_JSON_SAMPLE = JSON.stringify(
  {
    source: "Four screenshots re-uploaded for verification on November 3, 2026",
    subreddit: "r/Philippines",
    post_title: "Philippines projected to be second fastest-growing economy in SE Asia until 2035",
    scope: "All readable comments in screenshots; not a complete Reddit thread export.",
    transcription_notes: [
      "All 10 fully or partially visible comments appear exactly once; overlapping screenshots have been deduplicated.",
      "The three blockquoted article excerpts are embedded in the first OpenYonQ_ comment, not separate comments.",
      "The final reply is visibly truncated and is marked incomplete.",
      "Comment text is transcribed from screenshots without independently verifying claims or links."
    ],
    comments: [
      {
        id: "other_01",
        author: "ILikeFluffyThings",
        text: "If you are at the bottom, there is no other way but up.",
        thread: "Other top-level comments",
        reply_to: null,
        complete_in_screenshot: true
      },
      {
        id: "other_02",
        author: "Ch1ld1shBambin0",
        text: "Is the \"growing economy\" with us right now??",
        thread: "Other top-level comments",
        reply_to: null,
        complete_in_screenshot: true
      },
      {
        id: "other_03",
        author: "Bichobi_",
        text: "It's been growing for many years now. Problem is, hindi even ang distribution ng wealth.",
        thread: "Other top-level comments",
        reply_to: "other_02",
        complete_in_screenshot: true
      },
      {
        id: "debate_01",
        author: "OpenYonQ_",
        text: "the Philippine economy is projected to grow at an average annual rate of 5.8% from 2026 to 2035 under the baseline scenario.\n\nBASELINE SCENARIO\n\nDespite its relatively strong baseline forecast, the Philippines is also among the Southeast Asian economies facing the greatest downside exposure, according to the report.\n\nThe report noted that Indonesia, the Philippines, and Thailand would be the most exposed under a downside scenario because of their “capital-flow sensitivities, energy dependence, political uncertainty, and weaker structural momentum.”\n\nthere we go.",
        quoted_passages: [
          "the Philippine economy is projected to grow at an average annual rate of 5.8% from 2026 to 2035 under the baseline scenario.",
          "Despite its relatively strong baseline forecast, the Philippines is also among the Southeast Asian economies facing the greatest downside exposure, according to the report.",
          "The report noted that Indonesia, the Philippines, and Thailand would be the most exposed under a downside scenario because of their “capital-flow sensitivities, energy dependence, political uncertainty, and weaker structural momentum.”"
        ],
        complete_in_screenshot: true,
        thread: "OpenYonQ_ / MELONPANNNNN",
        reply_to: null,
        contains_quoted_article_excerpts: true
      },
      {
        id: "debate_02",
        author: "MELONPANNNNN",
        text: "Only a Filipino will see good news and focus on the bad.",
        complete_in_screenshot: true,
        thread: "OpenYonQ_ / MELONPANNNNN",
        reply_to: "debate_01"
      },
      {
        id: "debate_03",
        author: "OpenYonQ_",
        text: "its contextualizing the headline. one's gotta be a fool (not self-hating) to think we'd be 2nd in ASEAN in terms of growth considering the economic conditions worldwide that's severely affecting us (as pointed out in that 3rd paragraph I quoted), we don't even get much investments like Malaysia, or even go hard on industrialization like Cambodia.\n\nit's okay to point out we're lacking, nothing self-hating in what I said if that's what you're trying to spin this to.",
        complete_in_screenshot: true,
        thread: "OpenYonQ_ / MELONPANNNNN",
        reply_to: "debate_02"
      },
      {
        id: "debate_04",
        author: "MELONPANNNNN",
        text: "An average growth of 6% since 2016 which only slowed down recently to 4% due to the Iran War (which affected all of ASEAN). This isnt a one-time observation, its a trend.\n\nhttps://www.oecd.org/en/publications/oecd-economic-surveys-philippines-2026_f0e0c581-en/full-report/sustaining-growth-and-stability-amid-headwinds_a8f57a2c.html\n\nExports even got an all-time high this year.\n\nhttps://tribune.net.ph/2026/10/04/phl-exports-hit-35-year-high-at-911b",
        complete_in_screenshot: true,
        thread: "OpenYonQ_ / MELONPANNNNN",
        reply_to: "debate_03"
      },
      {
        id: "debate_05",
        author: "OpenYonQ_",
        text: "didn't you read? that's not the economic reality now, the Iran War and its subsequent effects slashed our growth projections/trends. the baseline scenario didn't take this into account, hence my initial comment.\n\nexports carried by semiconductors, good. is it enough to be 2nd in terms of economic growth in the region? I don't know. the neighbors are investing heavy on their own semicon industry.",
        complete_in_screenshot: true,
        thread: "OpenYonQ_ / MELONPANNNNN",
        reply_to: "debate_04"
      },
      {
        id: "debate_06",
        author: "MELONPANNNNN",
        text: "You do know high percentage growth naturally happens when an economy is catching up, right? That’s basic convergence theory\n\nhttps://www.economicshelp.org/blog/143243/economics/the-catch-up-effect/\n\nThat’s not downplaying Vietnam’s success, but if you can recognize how baseline catch-up potential works for them over a 10-year horizon, why refuse to see it here? Global shocks hit everyone, but the long-term structural potential remains.",
        complete_in_screenshot: true,
        thread: "OpenYonQ_ / MELONPANNNNN",
        reply_to: "debate_05"
      },
      {
        id: "debate_07",
        author: "OpenYonQ_",
        text: "really didn't answer anything. I didn't even mention Vietnam. you're just waffling a",
        complete_in_screenshot: false,
        thread: "OpenYonQ_ / MELONPANNNNN",
        reply_to: "debate_06"
      }
    ]
  },
  null,
  2
);
