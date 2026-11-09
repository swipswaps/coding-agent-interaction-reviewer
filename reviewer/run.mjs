// [2] https://nodejs.org/api/vm.html — node:vm is not a security mechanism.
import vm from 'node:vm'
const FUNCTION_NAME = { P1: 'lengthOfLongestSubstring', P2: 'isValid', P3: 'mergeTwoLists' }
function deepEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b) }
function toList(arr) { let h = null; for (let i = arr.length - 1; i >= 0; i--) h = { val: arr[i], next: h }; return h }
function fromList(n) { const o = []; while (n) { o.push(n.val); n = n.next } return o }
export function runCase(problemId, code, testCase) {
  const fnName = FUNCTION_NAME[problemId]
  if (!fnName) return { status: 'threw', error: `no function name for ${problemId}` }
  const context = vm.createContext({})
  let fn
  try { fn = vm.runInContext(`${code}\n; ${fnName}`, context, { timeout: 1000 }) }
  catch (err) { return { status: 'threw', error: `parse: ${err.message}` } }
  if (typeof fn !== 'function') return { status: 'threw', error: `${fnName} is not a function` }
  let input = testCase.input, expected = testCase.expected
  if (problemId === 'P3') { const [a, b] = input; input = [toList(a), toList(b)]; expected = fromList(toList(expected)) }
  let actual
  try { actual = fn(...(Array.isArray(input) ? input : [input])) }
  catch (err) { return { status: 'threw', error: err.message } }
  const normalised = problemId === 'P3' ? fromList(actual) : actual
  return deepEqual(normalised, expected) ? { status: 'pass', actual: normalised } : { status: 'fail', actual: normalised, expected }
}
