const STATUS_STYLES = {
  submitted:     "bg-blue-50 text-blue-700 border border-blue-200",
  under_review:  "bg-amber-50 text-amber-700 border border-amber-200",
  processing:    "bg-sky-50 text-sky-700 border border-sky-200",
  assigned:      "bg-indigo-50 text-indigo-700 border border-indigo-200",
  in_progress:   "bg-teal-50 text-teal-700 border border-teal-200",
  completed:     "bg-green-50 text-green-700 border border-green-200",
  rejected:      "bg-red-50 text-red-700 border border-red-200",
  cancelled:     "bg-gray-100 text-gray-500 border border-gray-200",
  requires_info: "bg-orange-50 text-orange-700 border border-orange-200",
};

const STATUS_LABELS = {
  submitted:     "Submitted",
  under_review:  "Under Review",
  processing:    "Processing",
  assigned:      "Assigned",
  in_progress:   "In Progress",
  completed:     "Completed",
  rejected:      "Rejected",
  cancelled:     "Cancelled",
  requires_info: "More Info Needed",
};

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-500 border border-gray-200";
  const label = STATUS_LABELS[status] ?? status;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
