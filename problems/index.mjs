export const PROBLEMS = [
  {
    id: 'P1', title: 'Longest substring without repeating characters',
    statement: 'Given a string s, return the length of the longest substring without repeating characters. Constraints: 0 <= s.length <= 5 * 10^4.',
    visibleTests: [
      { input: 'abcabcbb', expected: 3 },
      { input: 'bbbbb', expected: 1 },
      { input: 'pwwkew', expected: 3 },
    ],
    hiddenCases: [
      { input: '', expected: 0, catches: 'Solutions that assume s.length >= 1.', class: 'empty-input' },
      { input: ' ', expected: 1, catches: 'Solutions that strip whitespace.', class: 'whitespace' },
      { input: 'dvdf', expected: 3, catches: 'Solutions that jump left to i.', class: 'pointer-jump' },
      { input: 'abba', expected: 2, catches: 'Solutions that move left backwards.', class: 'stale-index' },
    ],
  },
  {
    id: 'P2', title: 'Valid parentheses',
    statement: 'Given a string s containing just ()[]{}, determine if the input string is valid. Constraints: 1 <= s.length <= 10^4.',
    visibleTests: [
      { input: '()', expected: true },
      { input: '()[]{}', expected: true },
      { input: '(]', expected: false },
    ],
    hiddenCases: [
      { input: '(', expected: false, catches: 'No bracket match check.', class: 'unmatched-open' },
      { input: ']', expected: false, catches: 'Pop from empty stack.', class: 'pop-empty' },
      { input: '([)]', expected: false, catches: 'Counting instead of matching.', class: 'interleaved' },
    ],
  },
  {
    id: 'P3', title: 'Merge two sorted lists',
    statement: 'Merge two sorted linked lists and return it as a sorted list.',
    visibleTests: [
      { input: [[1,2,4],[1,3,4]], expected: [1,1,2,3,4,4] },
      { input: [[],[]], expected: [] },
      { input: [[],[0]], expected: [0] },
    ],
    hiddenCases: [
      { input: [[5],[1,2,3]], expected: [1,2,3,5], catches: 'First-list bias.', class: 'first-list-bias' },
      { input: [[1,1,1],[1,1]], expected: [1,1,1,1,1], catches: 'Uses < not <=.', class: 'duplicate-drop' },
    ],
  },
]
