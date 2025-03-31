/**
 * @param {string} str
 * @returns {string}
 */
export function stripIndent(str) {
  const lines = str.split('\n');

  let minIndent = 0;
  if (lines.length > 0) {
    lines.forEach((line) => {
      const matches = line.match(/^[ \t]*(?=\S)/gm);
      if (matches) {
        const indent = matches[0].length;
        if (indent > 0 && (minIndent === 0 || indent < minIndent)) {
          minIndent = indent;
        }
      }
    });
  }

  return lines.map((line) => line.slice(minIndent)).join('\n').trim();
}
