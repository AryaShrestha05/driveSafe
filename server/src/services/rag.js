// RAG explanation layer.
//
// Given the model's flagged events, retrieve relevant context from the knowledge
// base (NHTSA reports, defensive-driving manuals, telematics research) and have an
// LLM generate a natural-language explanation + improvement tips.
//
// For now this returns canned, source-tagged feedback so the UI's feedback card is
// fully populated. Implement the real pipeline where marked.

const HAS_LLM = Boolean(process.env.ANTHROPIC_API_KEY);

const TEMPLATES = {
  aggressive_braking: {
    why: 'Drivers who brake aggressively within 1 second of a threshold event are ~3x more likely to be involved in rear-end collisions.',
    tip: 'Maintain a 3-second following distance and scan further ahead to anticipate stops earlier.',
    source: 'NHTSA — Crash Avoidance Research',
  },
  sharp_lane_change: {
    why: 'Abrupt lane changes reduce reaction time for surrounding drivers and are a leading factor in sideswipe incidents.',
    tip: 'Signal at least 3 seconds before changing lanes and check mirrors plus blind spot before moving.',
    source: 'Defensive Driving Manual §4',
  },
  tailgating: {
    why: 'Following too closely is cited in a large share of telematics-flagged risky trips and sharply raises collision risk at speed.',
    tip: 'Keep a minimum 3-second gap; double it in rain or low visibility.',
    source: 'Insurance Telematics Research',
  },
  smooth_driving: {
    why: 'Smooth acceleration and braking correlate with lower claim frequency in pay-per-mile programs.',
    tip: 'Keep it up — consistent, gentle inputs are exactly what telematics scoring rewards.',
    source: 'Metromile/Root program data',
  },
};

/**
 * @param {{events:Array, safetyScore:number}} analysis
 * @returns {Promise<{summary:string, items:Array}>}
 */
export async function explainEvents(analysis) {
  const items = analysis.events.map((e) => {
    const t = TEMPLATES[e.label] || TEMPLATES.smooth_driving;
    return {
      eventId: e.id,
      label: e.label,
      timestamp: e.tStart,
      why: t.why,
      tip: t.tip,
      source: t.source,
    };
  });

  if (HAS_LLM) {
    // TODO(rag):
    //   1. Build a query from each event label + context.
    //   2. Retrieve top-k chunks from the vector DB (LangChain/LlamaIndex).
    //   3. Prompt Claude with (retrieved chunks + model output) for the summary.
    // Return the same shape as below.
  }

  const summary =
    analysis.safetyScore >= 80
      ? 'Mostly safe driving with a few moments to tighten up.'
      : 'Several risky patterns detected — focus on following distance and smoother inputs.';

  return { summary, items };
}
