export function normalizeAnswer(answer) {
  return answer.toLowerCase().replace(/[₱,]/g, '').replace(/[^a-z0-9.%\- ]/g, '').replace(/\s+/g, ' ').trim();
}
