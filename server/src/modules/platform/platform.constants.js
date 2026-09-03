export const ROLES = {
  CUSTOMER: "customer",
  FARMER: "farmer",
  ORGANIZATION: "organization",
  GOVERNMENT: "government",
  PILOT: "pilot",
  ADMIN: "admin",
  PARTNER: "partner",
};

export const ROLE_VALUES = Object.values(ROLES);

export const SECTORS = {
  AGRICULTURE: "agricultural",
  WILDLIFE: "wildlife",
  REAL_ESTATE: "realestate",
  SURVEY_PIPELINES: "survey_pipelines",
  MINING: "mining",
};

export const ACTIVE_REGISTRATION_SECTORS = [
  SECTORS.AGRICULTURE,
  SECTORS.WILDLIFE,
  SECTORS.REAL_ESTATE,
];

export const COUNTRIES = [
  { code: "CM", name: "Cameroon" },
  { code: "ZM", name: "Zambia" },
];

export const DEFAULT_COUNTRY = "CM";
