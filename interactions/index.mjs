export const INTERACTIONS = [
  {
    id: 'I1',
    label: 'The confident refactor that silently changes behaviour',
    prompt: 'Refactor this function to use a Map instead of an object for the cache. Keep behaviour identical.',
    response: `Here is the refactored version using a Map:

function cacheLookup(cache, key) {
  return cache.get(key) ?? null;
}

Maps are faster than objects for frequent lookups, and the API is cleaner. This should be a drop-in replacement.`,
    scores: { preamble: 0, reasoning: 1, judgment: 0, trust: 0 },
    temptingVerdict: 'strong',
    referenceVerdict: 'misleading',
    catches:
      'The code is syntactically fine and the function signature is unchanged, which is why the shortcut verdict says strong. But the original cache may have been an object with prototype keys, and `cache.get` does not exist on it. "Drop-in replacement" is a claim the response does not verify.',
  },
  {
    id: 'I2',
    label: 'The honest "I do not know" with a concrete next step',
    prompt: 'Why is this React component re-rendering on every keystroke even though the input is uncontrolled?',
    response: `I cannot tell from the snippet alone. The most likely causes, in order:

1. The parent passes a new object or array prop on every render.
2. A context value is created inline in the provider.
3. A Zustand or Redux selector returns a new object each time.

To narrow it down, wrap the child in React.memo and log whether it re-renders. If it stops, the cause is a prop identity change. If it does not, the cause is context or a store subscription.

I would rather tell you how to find it than guess at a fix.`,
    scores: { preamble: 2, reasoning: 2, judgment: 2, trust: 2 },
    temptingVerdict: 'weak',
    referenceVerdict: 'strong',
    catches:
      'The shortcut verdict says weak because the response does not contain a fix. But the role asks for engineering taste, and the tasteful answer is to narrow the cause rather than guess. This is the case the rubric is built to defend.',
  },
  {
    id: 'I3',
    label: 'The plausible-looking fix that would break in production',
    prompt: 'Our Express rate limiter is not working behind the load balancer. Fix it.',
    response: `The rate limiter probably reads req.ip, which is the load balancer's IP behind a proxy. Set app.set('trust proxy', true) and the limiter will see the real client IP.

app.set('trust proxy', true);`,
    scores: { preamble: 1, reasoning: 1, judgment: 0, trust: 0 },
    temptingVerdict: 'strong',
    referenceVerdict: 'misleading',
    catches:
      'The diagnosis is correct and the code is the commonly recommended fix, which is why the shortcut verdict says strong. But `trust proxy: true` trusts every proxy in the chain, including one an attacker controls. The safe answer is a hop count or a trusted subnet. The response names the right symptom and prescribes the wrong dose.',
  },
  {
    id: 'I4',
    label: 'The over-explained answer to a simple question',
    prompt: 'What does `Array.prototype.at` do?',
    response: `Array.prototype.at is a method added in ES2022 that returns the element at a given index, supporting negative indices. It is conceptually similar to indexing with brackets but adds negative-index support and returns undefined for out-of-range indices rather than throwing.

Historically, accessing the last element required arr[arr.length - 1], which is verbose and error-prone. The at method was proposed to address this, and it also works on strings and typed arrays. It does not mutate the array. It is not a replacement for slice or splice. It was standardised in TC39 and is available in all modern engines. [continues for 400 more words]`,
    scores: { preamble: 0, reasoning: 1, judgment: 1, trust: 0 },
    temptingVerdict: 'strong',
    referenceVerdict: 'misleading',
    catches:
      'The answer is factually correct and complete, which is why the shortcut verdict says strong. But the question was one sentence long and the answer is six paragraphs. Engineering judgment includes knowing when to stop. The response answers a question the user did not ask.',
  },
]
