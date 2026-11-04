export interface PostOffice {
  name: string;
  code: string;
}

export interface PostalIndex {
  divisions: string[];
  /** division -> districts */
  districts: Record<string, string[]>;
  /** district -> thanas/upazilas */
  thanas: Record<string, string[]>;
  /** officeKey(district, thana) -> post offices */
  offices: Record<string, PostOffice[]>;
}

interface RawRow {
  division: string;
  district: string;
  thana: string;
  subOffice: string;
  postCode: string;
}

/* ---------- ডেটা সংশোধন টেবিল (postcodes.json-এর জানা ভুল) ---------- */

// ভুল বানানের জেলা -> সঠিক জেলা
const DISTRICT_ALIASES: Record<string, string> = {
  Mymensinghyns: 'Mymensingh',
};

// ভুল/ভিন্ন বানানের থানা -> একই থানায় মার্জ
const THANA_ALIASES: Record<string, string> = {
  Sripur: 'Sreepur',
  Kapashia: 'Kapasia',
  Muksudpur: 'Maksudpur',
  Rouzan: 'Raozan',
  Madarganjng: 'Madarganj',
  Balaganjgfhfghj: 'Balaganj',
  Jagnnathpur: 'Jagannathpur',
};

// "জেলা|পোস্ট অফিস" -> নিশ্চিত সঠিক কোড
const CODE_OVERRIDES: Record<string, string> = {
  'Panchagarh|Chotto Dab': '5040', // ডেটায় 4050 ছিল, পাশের Mirjapur = 5041
};

// কোড স্পষ্টভাবে ভুল ও সঠিকটা নিশ্চিত নই, তাই বাদ দেওয়া হয়েছে।
// এই এলাকার গ্রাহক "Not listed" বেছে নিজে কোড লিখবেন।
const EXCLUDED = new Set<string>([
  'Sunamganj|Dawrai Bazar', // 3127 হলো সিলেটের Kathal Khair-এর কোড
  'Sunamganj|Chourangi Bazar', // 3893 হলো নোয়াখালীর হাতিয়া রেঞ্জ
]);

/* ---------- Helpers ---------- */

const tidy = (v: unknown): string => String(v ?? '').replace(/\s+/g, ' ').trim();
const capitalize = (v: string): string =>
  v.replace(/(^|\s)([a-z])/g, (_, s: string, c: string) => s + c.toUpperCase());

export const officeKey = (district: string, thana: string): string => `${district}::${thana}`;

function normalize(rows: RawRow[]): PostalIndex {
  const districtsByDivision = new Map<string, Set<string>>();
  const thanasByDistrict = new Map<string, Set<string>>();
  const officesByThana = new Map<string, Map<string, PostOffice>>();

  for (const row of rows) {
    const division = capitalize(tidy(row.division));
    let district = capitalize(tidy(row.district));
    district = DISTRICT_ALIASES[district] ?? district;
    let thana = capitalize(tidy(row.thana));
    thana = THANA_ALIASES[thana] ?? thana;
    let name = tidy(row.subOffice);
    if (!name || name === '-') name = thana;
    name = capitalize(name);

    if (!division || !district || !thana) continue;

    const fixKey = `${district}|${name}`;
    if (EXCLUDED.has(fixKey)) continue;

    // "2030hh" -> "2030"; ৪ ডিজিট না হলে বাদ
    const code = CODE_OVERRIDES[fixKey] ?? tidy(row.postCode).replace(/\D/g, '');
    if (!/^\d{4}$/.test(code)) continue;

    if (!districtsByDivision.has(division)) districtsByDivision.set(division, new Set());
    districtsByDivision.get(division)!.add(district);

    if (!thanasByDistrict.has(district)) thanasByDistrict.set(district, new Set());
    thanasByDistrict.get(district)!.add(thana);

    const key = officeKey(district, thana);
    if (!officesByThana.has(key)) officesByThana.set(key, new Map());
    officesByThana.get(key)!.set(`${code}|${name.toLowerCase()}`, { name, code });
  }

  const sortAlpha = (a: string, b: string) => a.localeCompare(b, 'en');

  const districts: Record<string, string[]> = {};
  districtsByDivision.forEach((set, division) => {
    districts[division] = Array.from(set).sort(sortAlpha);
  });

  const thanas: Record<string, string[]> = {};
  thanasByDistrict.forEach((set, district) => {
    thanas[district] = Array.from(set).sort(sortAlpha);
  });

  const offices: Record<string, PostOffice[]> = {};
  officesByThana.forEach((map, key) => {
    offices[key] = Array.from(map.values()).sort(
      (a, b) => a.code.localeCompare(b.code) || a.name.localeCompare(b.name, 'en')
    );
  });

  return { divisions: Object.keys(districts).sort(sortAlpha), districts, thanas, offices };
}

/* ---------- Lazy loader (JSON আলাদা chunk-এ যায়, মূল bundle ভারী হয় না) ---------- */

let cache: Promise<PostalIndex> | null = null;

export function loadPostalIndex(): Promise<PostalIndex> {
  if (!cache) {
    cache = import('../data/postcodes.json')
      .then((mod) => {
        const rows = ((mod as unknown as { default?: RawRow[] }).default ?? mod) as unknown as RawRow[];
        return normalize(rows);
      })
      .catch((err) => {
        cache = null; // পরের retry-তে আবার চেষ্টা করবে
        throw err;
      });
  }
  return cache;
}