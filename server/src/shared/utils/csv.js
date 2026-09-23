// Spreadsheet apps evaluate a cell starting with = + - @ (or tab/CR) as a formula.
// Digits/spaces/+-(). alone can only compute arithmetic — no functions, links, or DDE —
// so phone numbers like "+237 670 000 000" are left untouched.
const FORMULA_TRIGGER = /^[=+\-@\t\r]/;
const PLAIN_NUMBER = /^[+-]?[\d\s().-]*$/;

export function escapeCell(value) {
  let str = value === null || value === undefined ? "" : String(value);
  if (FORMULA_TRIGGER.test(str) && !PLAIN_NUMBER.test(str)) str = `'${str}`;
  if (/[",\r\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export function toCsv(rows, columns) {
  const headers = columns.map((column) => escapeCell(column.header)).join(",");
  const lines = rows.map((row) => columns.map((column) => escapeCell(row[column.key])).join(","));
  return [headers, ...lines].join("\r\n");
}
