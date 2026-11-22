/** Rows -> CSV text. Values with a comma, quote or line break are quoted (as spreadsheet programs expect). */
export function toCsv(rows) {
  return rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
}

function csvCell(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

/** Lets the browser save the rows as a .csv file ("Save Report"). */
export function downloadCsv(fileName, rows) {
  // The byte order mark makes Excel read the file as UTF-8 (₹ and other characters)
  const blob = new Blob(['﻿', toCsv(rows)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
