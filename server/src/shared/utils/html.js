const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

// For any user-, admin-, or pilot-supplied text placed into an HTML email.
export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ENTITIES[ch]);
}
