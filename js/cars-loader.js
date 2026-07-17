// ============================================================
// AL-MATAR RENTALS — CAR DATA LOADER (Supabase-backed)
//
// This replaces the old "read CARS_DATA from cars-data.js" loader.
// loadCars() has the EXACT SAME name and return shape as before,
// so index.html / fleet.html / booking.html / global.js do NOT
// need to change at all — they just call loadCars() like always.
//
// If Supabase can't be reached (offline, wrong keys, etc.) this
// falls back to the old hardcoded js/cars-data.js so the site
// never shows a blank page.
// ============================================================

// ⚠️ REPLACE THESE TWO VALUES with your project's values
// Supabase Dashboard → Settings → API → Project URL / anon public key
const SUPABASE_URL = "https://rnmjtxwxlahqrmwpmpwj.supabase.co";
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJubWp0eHd4bGFocXJtd3BtcHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxODk0ODksImV4cCI6MjA5OTc2NTQ4OX0.aTeMDR72LDQdKlg00JXOlYLoJhhpL8ZAqNWggWoYpaQ';


let CARS_CACHE = null;

// Converts a Supabase row (snake_case) into the exact object shape
// your existing rendering code already expects (camelCase, same
// field names as the old CARS_DATA entries).
function rowToCarObject(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    image: row.image,               // array, same as before
    rating: row.rating,
    avail: row.avail,
    availClass: row.avail_class,
    badge: row.badge,
    badgeClass: row.badge_class,
    cat: row.cat || [],
    popular: row.popular,
    fuel: row.fuel,
    seats: row.seats,
    ac: row.ac,
    music: row.music,
    feats: row.feats || [],
    desc: row.description,
    hourlyRate: row.hourly_rate
  };
}

async function loadCars() {
  if (CARS_CACHE) return CARS_CACHE;

  try {
    const resp = await fetch(
      `${SUPABASE_URL}/rest/v1/cars?select=*&order=id.asc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    if (!resp.ok) throw new Error(`Supabase responded with ${resp.status}`);

    const rows = await resp.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('Supabase returned no cars');
    }

    CARS_CACHE = rows.map(rowToCarObject);
    return CARS_CACHE;

  } catch (err) {
    console.error('Could not load cars from Supabase, falling back to embedded data:', err);

    if (typeof CARS_DATA !== 'undefined' && Array.isArray(CARS_DATA) && CARS_DATA.length) {
      CARS_CACHE = CARS_DATA;
    } else {
      CARS_CACHE = [
        { id:1, name:'Suzuki Alto', type:'Economy', hourlyRate:450, image:[''], rating:4.9,
          avail:'Available', availClass:'avail-yes', badge:'Most Popular', badgeClass:'badge-blue',
          cat:['all','economy'], popular:10, fuel:'Petrol', seats:'5 Seats', ac:'AC', music:'Aux / BT',
          feats:['City commutes','With driver option'], desc:'Budget-friendly economy car.' }
      ];
    }
    if (typeof toast === 'function') toast('Could not load live car data — showing cached info', 'error');
    return CARS_CACHE;
  }
}
