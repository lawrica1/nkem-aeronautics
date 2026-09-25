export const PART_REQUEST_STATUS = {
  SUBMITTED: "submitted",
  IN_REVIEW: "in_review",
  IDENTIFIED: "identified",
  UNAVAILABLE: "unavailable",
  CLOSED: "closed",
};

export const PART_REQUEST_STATUS_VALUES = Object.values(PART_REQUEST_STATUS);

export const PART_REQUEST_STATUS_LABELS = {
  [PART_REQUEST_STATUS.SUBMITTED]: "Submitted",
  [PART_REQUEST_STATUS.IN_REVIEW]: "In Review",
  [PART_REQUEST_STATUS.IDENTIFIED]: "Part Identified",
  [PART_REQUEST_STATUS.UNAVAILABLE]: "Unavailable",
  [PART_REQUEST_STATUS.CLOSED]: "Closed",
};
