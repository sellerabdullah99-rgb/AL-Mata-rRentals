// ============================================
// AL-MATAR RENTALS — CAR DATA LOADER
// Uses embedded CARS_DATA (from js/cars-data.js) — no fetch().
// This means the site works when opened directly via file://
// double-click, with no local server required.
// ============================================

let CARS_CACHE = null;

async function loadCars() {
  if (CARS_CACHE) return CARS_CACHE;

  if (typeof CARS_DATA !== 'undefined' && Array.isArray(CARS_DATA) && CARS_DATA.length) {
    CARS_CACHE = CARS_DATA;
    return CARS_CACHE;
  }

  // Safety fallback if cars-data.js wasn't loaded before this script
  console.error('CARS_DATA not found — make sure js/cars-data.js is included before js/cars-loader.js');
  CARS_CACHE = [
    { id:1, name:'Suzuki Alto', type:'Economy', price:3000, image:'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80&auto=format&fit=crop', rating:4.9, avail:'Available', availClass:'avail-yes', badge:'Most Popular', badgeClass:'badge-blue', cat:['all','economy'], popular:10, fuel:'Petrol', seats:'5 Seats', ac:'AC', music:'Aux / BT', feats:['City commutes','With driver option'], desc:'Budget-friendly economy car.' }
  ];
  if (typeof toast === 'function') toast('Could not load car data — showing limited info', 'error');
  return CARS_CACHE;
}
