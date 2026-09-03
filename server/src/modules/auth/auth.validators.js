import { HttpError } from "../../shared/errors/HttpError.js";
import { ACTIVE_REGISTRATION_SECTORS, DEFAULT_COUNTRY, ROLES, SECTORS } from "../platform/platform.constants.js";
import { FIRM_VALUES } from "../firms/firms.constants.js";

export function validateSignup(body) {
  const required = ["sector", "surname", "name", "telephone", "email", "address", "password"];
  for (const field of required) {
    if (!body[field]) throw new HttpError(400, `${field} is required.`);
  }

  if (!ACTIVE_REGISTRATION_SECTORS.includes(body.sector)) {
    throw new HttpError(400, "A valid sector is required.");
  }

  if (body.sector === SECTORS.AGRICULTURE) {
    if (!body.crop && !body.otherCrop) {
      throw new HttpError(400, "crop is required for agricultural sign-ups.");
    }
    if (!body.firm || !FIRM_VALUES.includes(body.firm)) {
      throw new HttpError(400, "A valid firm affiliation is required.");
    }
    if (body.firm === "other" && !body.otherFirm) {
      throw new HttpError(400, "otherFirm is required when firm is Other.");
    }
  }

  if (body.sector === SECTORS.WILDLIFE && (!body.wildlifeOrg || !body.wildlifeRole)) {
    throw new HttpError(400, "wildlifeOrg and wildlifeRole are required for wildlife sign-ups.");
  }

  if (body.sector === SECTORS.REAL_ESTATE && !body.realEstatePurpose) {
    throw new HttpError(400, "realEstatePurpose is required for real estate/survey sign-ups.");
  }
}

export function normalizeSignup(body) {
  const role = body.sector === SECTORS.AGRICULTURE ? ROLES.FARMER : ROLES.CUSTOMER;

  return {
    role,
    sector: body.sector,
    accountType: body.accountType || (body.realEstatePurpose === "government" ? "government" : "individual"),
    country: body.country || DEFAULT_COUNTRY,
    surname: body.surname,
    name: body.name,
    sex: body.sex,
    telephone: body.telephone,
    email: body.email.toLowerCase(),
    address: body.address,
    region: body.region,
    district: body.district,
    crop: body.crop,
    otherCrop: body.otherCrop,
    firm: body.firm,
    otherFirm: body.otherFirm,
    wildlifeOrg: body.wildlifeOrg,
    wildlifeRole: body.wildlifeRole,
    realEstatePurpose: body.realEstatePurpose || "",
  };
}
