// ISO 3166-1 alpha-2 → E.164 dial code prefix
// ZM and CM listed first (primary markets), then Africa, then the rest of the world.
export const DIAL_CODES = {
  // Primary markets
  ZM: "+260", CM: "+237",

  // Africa
  DZ: "+213", AO: "+244", BJ: "+229", BW: "+267", BF: "+226", BI: "+257",
  CV: "+238", CF: "+236", TD: "+235", KM: "+269", CG: "+242", CD: "+243",
  DJ: "+253", EG: "+20",  GQ: "+240", ER: "+291", SZ: "+268", ET: "+251",
  GA: "+241", GM: "+220", GH: "+233", GN: "+224", GW: "+245", CI: "+225",
  KE: "+254", LS: "+266", LR: "+231", LY: "+218", MG: "+261", MW: "+265",
  ML: "+223", MR: "+222", MU: "+230", MA: "+212", MZ: "+258", NA: "+264",
  NE: "+227", NG: "+234", RW: "+250", ST: "+239", SN: "+221", SL: "+232",
  SO: "+252", ZA: "+27",  SS: "+211", SD: "+249", TZ: "+255", TG: "+228",
  TN: "+216", UG: "+256", ZW: "+263",

  // Europe
  AL: "+355", AD: "+376", AM: "+374", AT: "+43",  AZ: "+994", BY: "+375",
  BE: "+32",  BA: "+387", BG: "+359", HR: "+385", CY: "+357", CZ: "+420",
  DK: "+45",  EE: "+372", FI: "+358", FR: "+33",  GE: "+995", DE: "+49",
  GR: "+30",  HU: "+36",  IS: "+354", IE: "+353", IT: "+39",  LV: "+371",
  LI: "+423", LT: "+370", LU: "+352", MK: "+389", MT: "+356", MD: "+373",
  MC: "+377", ME: "+382", NL: "+31",  NO: "+47",  PL: "+48",  PT: "+351",
  RO: "+40",  RU: "+7",   SM: "+378", RS: "+381", SK: "+421", SI: "+386",
  ES: "+34",  SE: "+46",  CH: "+41",  TR: "+90",  UA: "+380", GB: "+44",

  // Americas
  AG: "+1268", AR: "+54",  BS: "+1242", BB: "+1246", BZ: "+501",  BO: "+591",
  BR: "+55",   CA: "+1",   CL: "+56",   CO: "+57",   CR: "+506",  CU: "+53",
  DM: "+1767", DO: "+1809",EC: "+593",  SV: "+503",  GD: "+1473", GT: "+502",
  GY: "+592",  HT: "+509", HN: "+504",  JM: "+1876", MX: "+52",   NI: "+505",
  PA: "+507",  PY: "+595", PE: "+51",   KN: "+1869", LC: "+1758", VC: "+1784",
  SR: "+597",  TT: "+1868",US: "+1",    UY: "+598",  VE: "+58",

  // Asia & Pacific
  AF: "+93",  AU: "+61",  BH: "+973", BD: "+880", BT: "+975", BN: "+673",
  KH: "+855", CN: "+86",  FJ: "+679", IN: "+91",  ID: "+62",  IR: "+98",
  IQ: "+964", IL: "+972", JP: "+81",  JO: "+962", KI: "+686", KW: "+965",
  KG: "+996", LA: "+856", LB: "+961", MY: "+60",  MV: "+960", MH: "+692",
  FM: "+691", MN: "+976", NR: "+674", NP: "+977", NZ: "+64",  KP: "+850",
  OM: "+968", PK: "+92",  PW: "+680", PG: "+675", PH: "+63",  QA: "+974",
  SA: "+966", SG: "+65",  SB: "+677", KR: "+82",  LK: "+94",  SY: "+963",
  TW: "+886", TJ: "+992", TH: "+66",  TL: "+670", TO: "+676", TM: "+993",
  TV: "+688", AE: "+971", UZ: "+998", VU: "+678", VN: "+84",  WS: "+685",
  YE: "+967",
};

export function getDialCode(countryCode) {
  return DIAL_CODES[(countryCode || "").toUpperCase()] ?? "";
}

// ISO 3166-1 alpha-2 → emoji flag (e.g. "ZM" → "🇿🇲")
export function countryCodeToFlag(code) {
  if (!code || code.length !== 2) return "🌐";
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
    .join("");
}
