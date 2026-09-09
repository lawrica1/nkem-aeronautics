// Administrative regions/divisions for the two countries the platform serves.
export const CM_REGIONS = [
  { value: "adamawa", label: "Adamawa", divisions: ["Djérem", "Faro-et-Déo", "Mayo-Banyo", "Mbéré", "Vina"] },
  { value: "centre", label: "Centre", divisions: ["Haute-Sanaga", "Lekié", "Mbam-et-Inoubou", "Mbam-et-Kim", "Méfou-et-Afamba", "Méfou-et-Akono", "Mfoundi", "Nyong-et-Kéllé", "Nyong-et-Mfoumou", "Nyong-et-So'o"] },
  { value: "east", label: "East", divisions: ["Boumba-et-Ngoko", "Haut-Nyong", "Kadey", "Lom-et-Djérem"] },
  { value: "far-north", label: "Far North", divisions: ["Diamaré", "Logone-et-Chari", "Mayo-Danay", "Mayo-Kani", "Mayo-Sava", "Mayo-Tsanaga"] },
  { value: "littoral", label: "Littoral", divisions: ["Moungo", "Nkam", "Sanaga-Maritime", "Wouri"] },
  { value: "north", label: "North", divisions: ["Bénoué", "Faro", "Mayo-Louti", "Mayo-Rey"] },
  { value: "northwest", label: "Northwest", divisions: ["Boyo", "Bui", "Donga-Mantung", "Menchum", "Mezam", "Momo", "Ngoketunjia"] },
  { value: "west", label: "West", divisions: ["Bamboutos", "Haut-Nkam", "Hauts-Plateaux", "Koung-Khi", "Menoua", "Mifi", "Ndé", "Noun"] },
  { value: "south", label: "South", divisions: ["Dja-et-Lobo", "Mvila", "Océan", "Vallée-du-Ntem"] },
  { value: "southwest", label: "Southwest", divisions: ["Fako", "Koupé-Manengouba", "Lebialem", "Manyu", "Meme", "Ndian"] },
];

export const ZM_REGIONS = [
  { value: "central", label: "Central", divisions: ["Kabwe", "Chibombo", "Kapiri Mposhi", "Mkushi", "Mumbwa", "Serenje"] },
  { value: "copperbelt", label: "Copperbelt", divisions: ["Kitwe", "Ndola", "Chingola", "Mufulira", "Luanshya", "Kalulushi", "Chililabombwe"] },
  { value: "eastern", label: "Eastern", divisions: ["Chipata", "Katete", "Petauke", "Lundazi", "Nyimba", "Chadiza"] },
  { value: "luapula", label: "Luapula", divisions: ["Mansa", "Kawambwa", "Nchelenge", "Samfya", "Mwense"] },
  { value: "lusaka", label: "Lusaka", divisions: ["Lusaka", "Kafue", "Chongwe", "Luangwa"] },
  { value: "muchinga", label: "Muchinga", divisions: ["Chinsali", "Mpika", "Isoka", "Nakonde"] },
  { value: "northern", label: "Northern", divisions: ["Kasama", "Mbala", "Mporokoso", "Luwingu", "Mungwi"] },
  { value: "north-western", label: "North-Western", divisions: ["Solwezi", "Kasempa", "Mwinilunga", "Zambezi", "Kabompo"] },
  { value: "southern", label: "Southern", divisions: ["Livingstone", "Choma", "Mazabuka", "Monze", "Kalomo", "Namwala"] },
  { value: "western", label: "Western", divisions: ["Mongu", "Senanga", "Kalabo", "Sesheke", "Lukulu"] },
];

function regionsFor(country) {
  return country === "ZM" ? ZM_REGIONS : CM_REGIONS;
}

export function getRegionOptions(country) {
  return regionsFor(country).map(({ value, label }) => ({ value, label }));
}

export function getDivisionOptions(country, regionValue) {
  const divisions = regionsFor(country).find((r) => r.value === regionValue)?.divisions ?? [];
  return divisions.map((d) => ({ value: d, label: d }));
}
