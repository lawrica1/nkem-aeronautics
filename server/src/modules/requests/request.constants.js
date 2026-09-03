export const REQUEST_STATUS = {
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  PROCESSING: "processing",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
  REQUIRES_INFO: "requires_info",
};

export const REQUEST_STATUS_VALUES = Object.values(REQUEST_STATUS);

export const REQUEST_STATUS_LABELS = {
  [REQUEST_STATUS.SUBMITTED]: "Submitted",
  [REQUEST_STATUS.UNDER_REVIEW]: "Under Review",
  [REQUEST_STATUS.PROCESSING]: "Processing",
  [REQUEST_STATUS.ASSIGNED]: "Assigned",
  [REQUEST_STATUS.IN_PROGRESS]: "In Progress",
  [REQUEST_STATUS.COMPLETED]: "Completed",
  [REQUEST_STATUS.REJECTED]: "Rejected",
  [REQUEST_STATUS.CANCELLED]: "Cancelled",
  [REQUEST_STATUS.REQUIRES_INFO]: "More Info Needed",
};
