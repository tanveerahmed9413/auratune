// Pure, framework-free expression classifier (easy to unit test).
// Input: a map of MediaPipe/ARKit blendshape scores (0..1). Output: scores per mood.

export const EXPRESSIONS = ["happy", "sad", "angry", "surprised", "neutral"];

const avg = (...v) => v.reduce((a, b) => a + b, 0) / v.length;
const clamp01 = (n) => Math.max(0, Math.min(1, n));

/** Convert a blendshape category list into a plain { name: score } object. */
export const toScoreMap = (categories = []) => {
  const map = {};
  for (const c of categories) map[c.categoryName] = c.score;
  return map;
};

/**
 * Turn raw blendshapes into per-expression scores in 0..1.
 * Each emotion uses the facial action units that actually define it, and is
 * suppressed by the signals that contradict it (e.g. a smile cancels "sad").
 */
export const scoreExpressions = (b) => {
  const g = (k) => b[k] ?? 0;

  const smile = avg(g("mouthSmileLeft"), g("mouthSmileRight"));
  const cheek = avg(g("cheekSquintLeft"), g("cheekSquintRight"));
  const frown = avg(g("mouthFrownLeft"), g("mouthFrownRight"));
  const browDown = avg(g("browDownLeft"), g("browDownRight"));
  const browOuterUp = avg(g("browOuterUpLeft"), g("browOuterUpRight"));
  const browInnerUp = g("browInnerUp");
  const eyeWide = avg(g("eyeWideLeft"), g("eyeWideRight"));
  const eyeSquint = avg(g("eyeSquintLeft"), g("eyeSquintRight"));
  const noseSneer = avg(g("noseSneerLeft"), g("noseSneerRight"));
  const mouthPress = avg(g("mouthPressLeft"), g("mouthPressRight"));
  const mouthStretch = avg(g("mouthStretchLeft"), g("mouthStretchRight"));
  const jawOpen = g("jawOpen");
  const shrugLower = g("mouthShrugLower");
  const lowerDown = avg(g("mouthLowerDownLeft"), g("mouthLowerDownRight"));

  // Happy: raised mouth corners (+ cheeks pushing up for a genuine smile).
  const happy = clamp01(smile * 1.6 + cheek * 0.5);

  // Surprised: mouth open + brows/eyes raised. Needs BOTH, so a yawn or talking won't trigger it.
  const raised = clamp01(browInnerUp * 0.6 + browOuterUp * 0.8 + eyeWide * 1.0);
  const surprised = clamp01(Math.min(jawOpen * 2.2, 1) * 0.5 + raised * 0.7) *
    (raised > 0.2 && jawOpen > 0.12 ? 1 : 0.35);

  // Sad: mouth corners down, inner brows pulled up, chin pushed up. A smile cancels it.
  const sad = clamp01(
    (Math.max(0, frown - 0.05) * 1.9 + browInnerUp * 0.7 + shrugLower * 0.6 + mouthPress * 0.2) *
      (1 - clamp01(smile * 2.5)) *
      (1 - clamp01(jawOpen * 2)),
  );

  // Angry: brows pulled down & together, nose wrinkled, lips pressed, eyes narrowed.
  const angry = clamp01(
    // The first ~0.2 of brow-down is just a resting/concentrating face, so ignore it.
    (Math.max(0, browDown - 0.2) * 1.9 + noseSneer * 1.2 + Math.max(0, eyeSquint - 0.1) * 0.5 + Math.max(0, mouthPress - 0.1) * 0.8) *
      (1 - clamp01(smile * 3)) *
      (1 - clamp01(browInnerUp * 1.5)),
  );

  const strongest = Math.max(happy, sad, angry, surprised);
  // Neutral is the "nothing stood out" score.
  const neutral = clamp01(1 - strongest * 1.6 - lowerDown * 0.2 - mouthStretch * 0.1);

  return { happy, sad, angry, surprised, neutral };
};

// An expression has to clear its own bar to beat "neutral".
const THRESHOLDS = { happy: 0.3, surprised: 0.4, sad: 0.26, angry: 0.3 };

/** Pick the winning expression from averaged scores. */
export const classify = (scores) => {
  let best = "neutral";
  let bestScore = 0;
  for (const name of ["happy", "surprised", "sad", "angry"]) {
    if (scores[name] >= THRESHOLDS[name] && scores[name] > bestScore) {
      best = name;
      bestScore = scores[name];
    }
  }
  if (best === "neutral") return { expression: "neutral", confidence: scores.neutral };

  // Confidence = how clearly it beat the runner-up and its own threshold.
  const runnerUp = Math.max(
    ...["happy", "surprised", "sad", "angry"]
      .filter((n) => n !== best)
      .map((n) => scores[n]),
  );
  const margin = clamp01((bestScore - runnerUp) / Math.max(bestScore, 0.01));
  const strength = clamp01(bestScore / (THRESHOLDS[best] * 2));
  return { expression: best, confidence: clamp01(0.5 * margin + 0.5 * strength) };
};

/** Average a list of per-frame score objects (trimmed to ignore blinks/outliers). */
export const aggregate = (frames) => {
  const out = {};
  for (const name of EXPRESSIONS) {
    const vals = frames.map((f) => f[name]).sort((a, b) => a - b);
    const trim = vals.length >= 8 ? Math.floor(vals.length * 0.15) : 0;
    const kept = vals.slice(trim, vals.length - trim);
    out[name] = kept.reduce((a, b) => a + b, 0) / (kept.length || 1);
  }
  return out;
};

/** Which song moods to recommend for a detected face expression. */
export const MOOD_TO_SONG_MOODS = {
  happy: ["happy", "energetic"],
  sad: ["sad", "calm"],
  angry: ["angry", "energetic"],
  surprised: ["surprised", "energetic"],
  neutral: ["calm", "neutral"],
};
