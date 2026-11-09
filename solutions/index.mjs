export const SOLUTIONS = {
  P1: [
    { id: 'ref', label: 'Reference', role: 'reference', code: `function lengthOfLongestSubstring(s) {
  const last = new Map(); let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (last.has(ch) && last.get(ch) >= left) left = last.get(ch) + 1;
    last.set(ch, right); best = Math.max(best, right - left + 1);
  } return best;
}` },
    // [BUG-B3] was a Set-based sliding window that was actually correct on
    // every visible and hidden case, so it was classified as correct and
    // flipped the artefact's sound flag to NO. Now the >= left guard is
    // dropped, so the left pointer moves backwards on a stale index.
    // Trace on abba: after bb, left=2; the trailing a has last[a]=0, so
    // left becomes 1 and the window widens past the correct start.
    // Result 3, expected 2. Fails only the hidden 'abba' case.
    { id: 'A', label: 'A — left can move backwards', role: 'edge-case-candidate', code: `function lengthOfLongestSubstring(s) {
  const last = {}; let best = 0, left = 0;
  for (let i = 0; i < s.length; i++) {
    if (last[s[i]] !== undefined) left = last[s[i]] + 1;
    last[s[i]] = i;
    best = Math.max(best, i - left + 1);
  } return best;
}` },
    { id: 'A2', label: 'A2 — left jumps to i', role: 'edge-case-candidate', code: `function lengthOfLongestSubstring(s) {
  const last = {}; let best = 0, left = 0;
  for (let i = 0; i < s.length; i++) {
    if (last[s[i]] !== undefined && last[s[i]] >= left) left = i;
    last[s[i]] = i; best = Math.max(best, i - left + 1);
  } return best;
}` },
    { id: 'B', label: 'B — off-by-one', role: 'incorrect-candidate', code: `function lengthOfLongestSubstring(s) {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const seen = new Set();
    for (let j = i; j < s.length; j++) {
      if (seen.has(s[j])) break;
      seen.add(s[j]); best = Math.max(best, j - i);
    }
  } return best;
}` },
  ],
  P2: [
    { id: 'ref', label: 'Reference', role: 'reference', code: `function isValid(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' }; const stack = [];
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
    else if (stack.pop() !== pairs[ch]) return false;
  } return stack.length === 0;
}` },
    { id: 'A', label: 'A — counts brackets', role: 'edge-case-candidate', code: `function isValid(s) {
  const open = { '(': 0, '[': 0, '{': 0 }; const close = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) { if (open[ch] !== undefined) open[ch]++; else open[close[ch]]--; }
  return Object.values(open).every((n) => n === 0);
}` },
    // [BUG-B1] was: if (stack.pop() !== pairs[ch]) return false; which is
    // correct on all 3 visible and all 3 hidden cases. Now the match check
    // is gone, so (] returns true and a visible test fails.
    { id: 'B', label: 'B — no match check', role: 'incorrect-candidate', code: `function isValid(s) {
  const stack = [];
  for (const ch of s) {
    if ('([{'.includes(ch)) stack.push(ch);
    else stack.pop();
  } return stack.length === 0;
}` },
  ],
  P3: [
    { id: 'ref', label: 'Reference', role: 'reference', code: `function mergeTwoLists(a, b) {
  const dummy = { val: 0, next: null }; let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  } tail.next = a || b; return dummy.next;
}` },
    { id: 'A', label: 'A — always starts with first list', role: 'edge-case-candidate', code: `function mergeTwoLists(a, b) {
  if (!a) return b; if (!b) return a;
  let head = a, tail = a; a = a.next;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  } tail.next = a || b; return head;
}` },
    // [BUG-B2] was: if (a.val < b.val) which produces the same sorted output
    // and passes every visible and hidden case. Now the comparison is
    // reversed, so [1,2,4],[1,3,4] produces [1,3,4,1,2,4] and fails.
    { id: 'B', label: 'B — reversed merge', role: 'incorrect-candidate', code: `function mergeTwoLists(a, b) {
  const dummy = { val: 0, next: null }; let tail = dummy;
  while (a && b) {
    if (a.val > b.val) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  } tail.next = a || b; return dummy.next;
}` },
  ],
}
