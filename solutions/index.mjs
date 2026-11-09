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
