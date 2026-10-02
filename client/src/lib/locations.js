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

const REGION_MAP = { ZM: ZM_REGIONS, CM: CM_REGIONS };

// Cameroon subdivisions (arrondissements), keyed by the division names above.
// ponytail: compiled by hand, not from the official MINAT list — the form offers
// "Other" free text, so a missing or misspelled entry never blocks anyone. Replace
// with the official list if exact names matter for reporting.
export const CM_SUBDIVISIONS = {
  // Adamawa
  "Djérem": ["Ngaoundal", "Tibati"],
  "Faro-et-Déo": ["Galim-Tignère", "Kontcha", "Mayo-Baléo", "Tignère"],
  "Mayo-Banyo": ["Bankim", "Banyo", "Mayo-Darlé"],
  "Mbéré": ["Dir", "Djohong", "Meiganga", "Ngaoui"],
  "Vina": ["Belel", "Martap", "Mbe", "Nganha", "Ngaoundéré 1er", "Ngaoundéré 2e", "Ngaoundéré 3e", "Nyambaka"],
  // Centre
  "Haute-Sanaga": ["Bibey", "Lembe-Yezoum", "Mbandjock", "Minta", "Nanga-Eboko", "Nkoteng", "Nsem"],
  "Lekié": ["Batchenga", "Ebebda", "Elig-Mfomo", "Evodoula", "Lobo", "Monatélé", "Obala", "Okola", "Sa'a"],
  "Mbam-et-Inoubou": ["Bafia", "Bokito", "Deuk", "Kiiki", "Kon-Yambetta", "Makénéné", "Ndikiniméki", "Nitoukou", "Ombessa"],
  "Mbam-et-Kim": ["Mbangassina", "Ngambé-Tikar", "Ngoro", "Ntui", "Yoko"],
  "Méfou-et-Afamba": ["Afanloum", "Assamba", "Awaé", "Edzendouan", "Esse", "Mfou", "Nkolafamba", "Olanguina", "Soa"],
  "Méfou-et-Akono": ["Akono", "Bikok", "Mbankomo", "Ngoumou"],
  "Mfoundi": ["Yaoundé 1er", "Yaoundé 2e", "Yaoundé 3e", "Yaoundé 4e", "Yaoundé 5e", "Yaoundé 6e", "Yaoundé 7e"],
  "Nyong-et-Kéllé": ["Biyouha", "Bondjock", "Bot-Makak", "Dibang", "Eséka", "Makak", "Matomb", "Messondo", "Ngog-Mapubi", "Nguibassal"],
  "Nyong-et-Mfoumou": ["Akonolinga", "Ayos", "Endom", "Mengang", "Nyakokombo"],
  "Nyong-et-So'o": ["Akoeman", "Dzeng", "Mbalmayo", "Mengueme", "Ngomedzap", "Nkolmetet"],
  // East
  "Boumba-et-Ngoko": ["Gari-Gombo", "Moloundou", "Salapoumbé", "Yokadouma"],
  "Haut-Nyong": ["Abong-Mbang", "Angossas", "Atok", "Dimako", "Doumaintang", "Doumé", "Lomié", "Mboma", "Messamena", "Messok", "Mindourou", "Ngoyla", "Nguelemendouka", "Somalomo"],
  "Kadey": ["Batouri", "Kentzou", "Kette", "Mbang", "Ndelele", "Nguelebok", "Ouli"],
  "Lom-et-Djérem": ["Bélabo", "Bertoua 1er", "Bertoua 2e", "Bétaré-Oya", "Diang", "Garoua-Boulaï", "Mandjou", "Ngoura"],
  // Far North
  "Diamaré": ["Bogo", "Dargala", "Gazawa", "Maroua 1er", "Maroua 2e", "Maroua 3e", "Meri", "Ndoukoula", "Pétté"],
  "Logone-et-Chari": ["Blangoua", "Darak", "Fotokol", "Goulfey", "Hilé-Alifa", "Kousséri", "Logone-Birni", "Makary", "Waza", "Zina"],
  "Mayo-Danay": ["Datcheka", "Gobo", "Guémé", "Guéré", "Kaï-Kaï", "Kalfou", "Kar-Hay", "Maga", "Tchatibali", "Vélé", "Wina", "Yagoua"],
  "Mayo-Kani": ["Guidiguis", "Kaélé", "Mindif", "Moulvoudaye", "Moutourwa", "Porhi", "Taibong"],
  "Mayo-Sava": ["Kolofata", "Mora", "Tokombéré"],
  "Mayo-Tsanaga": ["Bourrha", "Hina", "Koza", "Mayo-Moskota", "Mogodé", "Mokolo", "Soulédé-Roua"],
  // Littoral
  "Moungo": ["Baré-Bakem", "Dibombari", "Loum", "Manjo", "Mbanga", "Melong", "Mombo", "Njombé-Penja", "Nkongsamba 1er", "Nkongsamba 2e", "Nkongsamba 3e", "Nlonako"],
  "Nkam": ["Nkondjock", "Nord-Makombé", "Yabassi", "Yingui"],
  "Sanaga-Maritime": ["Dibamba", "Dizangué", "Édéa 1er", "Édéa 2e", "Massock-Songloulou", "Mouanko", "Ndom", "Ngambé", "Ngwei", "Nyanon", "Pouma"],
  "Wouri": ["Douala 1er", "Douala 2e", "Douala 3e", "Douala 4e", "Douala 5e", "Douala 6e"],
  // North
  "Bénoué": ["Barndaké", "Baschéo", "Bibémi", "Dembo", "Demsa", "Gashiga", "Garoua 1er", "Garoua 2e", "Garoua 3e", "Lagdo", "Pitoa", "Tcheboa", "Touroua"],
  "Faro": ["Beka", "Poli"],
  "Mayo-Louti": ["Figuil", "Guider", "Mayo-Oulo"],
  "Mayo-Rey": ["Madingring", "Rey-Bouba", "Tcholliré", "Touboro"],
  // Northwest
  "Boyo": ["Belo", "Bum", "Fundong", "Njinikom"],
  "Bui": ["Elak-Oku", "Jakiri", "Kumbo", "Mbven", "Nkum", "Noni"],
  "Donga-Mantung": ["Ako", "Misaje", "Ndu", "Nkambé", "Nwa"],
  "Menchum": ["Benakuma", "Fungom", "Furu-Awa", "Wum"],
  "Mezam": ["Bafut", "Bali", "Bamenda 1er", "Bamenda 2e", "Bamenda 3e", "Santa", "Tubah"],
  "Momo": ["Andek", "Batibo", "Mbengwi", "Njikwa", "Widikum-Boffe"],
  "Ngoketunjia": ["Babessi", "Balikumbat", "Ndop"],
  // West
  "Bamboutos": ["Babadjou", "Batcham", "Galim", "Mbouda"],
  "Haut-Nkam": ["Bafang", "Bakou", "Bana", "Bandja", "Banka", "Kékem"],
  "Hauts-Plateaux": ["Baham", "Bamendjou", "Bangou", "Batié"],
  "Koung-Khi": ["Bandjoun", "Bayangam", "Demding"],
  "Menoua": ["Dschang", "Fokoué", "Fongo-Tongo", "Nkong-Ni", "Penka-Michel", "Santchou"],
  "Mifi": ["Bafoussam 1er", "Bafoussam 2e", "Bafoussam 3e"],
  "Ndé": ["Bangangté", "Bassamba", "Bazou", "Tonga"],
  "Noun": ["Bangourain", "Foumban", "Foumbot", "Kouoptamo", "Koutaba", "Magba", "Malantouen", "Massangam", "Njimom"],
  // South
  "Dja-et-Lobo": ["Bengbis", "Djoum", "Meyomessala", "Meyomessi", "Mintom", "Oveng", "Sangmélima", "Zoétélé"],
  "Mvila": ["Biwong-Bane", "Biwong-Bulu", "Ebolowa 1er", "Ebolowa 2e", "Efoulan", "Mengong", "Mvangan", "Ngoulemakong"],
  "Océan": ["Akom II", "Bipindi", "Campo", "Kribi 1er", "Kribi 2e", "Lokoundjé", "Lolodorf", "Mvengue", "Niete"],
  "Vallée-du-Ntem": ["Ambam", "Kyé-Ossi", "Ma'an", "Olamze"],
  // Southwest
  "Fako": ["Buea", "Limbe 1er", "Limbe 2e", "Limbe 3e", "Muyuka", "Tiko", "West Coast"],
  "Koupé-Manengouba": ["Bangem", "Nguti", "Tombel"],
  "Lebialem": ["Alou", "Menji", "Wabane"],
  "Manyu": ["Akwaya", "Eyumodjock", "Mamfe", "Upper Bayang"],
  "Meme": ["Konye", "Kumba 1er", "Kumba 2e", "Kumba 3e", "Mbonge"],
  "Ndian": ["Bamusso", "Dikome-Balue", "Ekondo-Titi", "Idabato", "Isanguele", "Kombo-Abedimo", "Kombo-Itindi", "Mundemba", "Toko"],
};

function regionsFor(country) {
  return REGION_MAP[country] ?? [];
}

// Zambia has no subdivision list, so this returns [] there and the form falls back to free text.
export function getSubdivisionOptions(country, division) {
  if (country === "ZM") return [];
  return (CM_SUBDIVISIONS[division] ?? []).map((s) => ({ value: s, label: s }));
}

export function getRegionOptions(country) {
  return regionsFor(country).map(({ value, label }) => ({ value, label }));
}

export function getDivisionOptions(country, regionValue) {
  const divisions = regionsFor(country).find((r) => r.value === regionValue)?.divisions ?? [];
  return divisions.map((d) => ({ value: d, label: d }));
}
