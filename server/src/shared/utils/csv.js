function escapeCell(value) {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export function toCsv(rows, columns) {
  const headers = columns.map((column) => escapeCell(column.header)).join(",");
  const lines = rows.map((row) => columns.map((column) => escapeCell(row[column.key])).join(","));
  return [headers, ...lines].join("\r\n");
}
