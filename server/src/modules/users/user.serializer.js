import { firmLabel } from "../firms/firms.constants.js";

export function serializeUser(user) {
  return {
    id: user.id,
    role: user.role,
    sector: user.sector,
    accountType: user.accountType,
    country: user.country,
    surname: user.surname,
    name: user.name,
    sex: user.sex,
    telephone: user.telephone,
    email: user.email,
    address: user.address,
    region: user.region,
    district: user.district,
    crop: user.crop,
    otherCrop: user.otherCrop,
    firm: user.firm,
    firmLabel: firmLabel(user.firm, user.otherFirm),
    otherFirm: user.otherFirm,
    wildlifeOrg: user.wildlifeOrg,
    wildlifeRole: user.wildlifeRole,
    realEstatePurpose: user.realEstatePurpose,
    identificationNumber: user.identificationNumber,
    isVerified: user.isVerified,
    createdAt: user.createdAt?.toISOString?.() ?? user.createdAt,
    updatedAt: user.updatedAt?.toISOString?.() ?? user.updatedAt,
  };
}
