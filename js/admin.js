// ============================================================
// AL-MATAR RENTALS — ADMIN DASHBOARD LOGIC
// Uses supabase-js (loaded via CDN in admin.html) for both
// Auth (login gate) and the CRUD calls. No backend server needed.
// ============================================================

// ⚠️ Same values as in js/cars-loader.js
const SUPABASE_URL = "https://rnmjtxwxlahqrmwpmpwj.supabase.co";
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJubWp0eHd4bGFocXJtd3BtcHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxODk0ODksImV4cCI6MjA5OTc2NTQ4OX0.aTeMDR72LDQdKlg00JXOlYLoJhhpL8ZAqNWggWoYpaQ';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loginBox = document.getElementById('loginBox');
const appBox = document.getElementById('appBox');

function showMsg(elId, text, type) {
  const el = document.getElementById(elId);
  el.innerHTML = `<div class="msg ${type}">${text}</div>`;
  setTimeout(() => { el.innerHTML = ''; }, 4000);
}

// ---------- AUTH ----------

async function checkSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    loginBox.style.display = 'none';
    appBox.style.display = 'block';
    loadCarsTable();
  } else {
    loginBox.style.display = 'block';
    appBox.style.display = 'none';
  }
}

document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!email || !password) { showMsg('loginMsg', 'Enter email and password', 'error'); return; }

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    showMsg('loginMsg', error.message, 'error');
  } else {
    checkSession();
  }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await supabaseClient.auth.signOut();
  checkSession();
});

// ---------- CRUD ----------

function csvToArray(str) {
  return str.split(',').map(s => s.trim()).filter(Boolean);
}

function clearForm() {
  ['carId','fName','fType','fRate','fRating','fPopular','fAvail','fBadge',
   'fFuel','fSeats','fAc','fMusic','fCat','fFeats','fImage','fDesc']
   .forEach(id => document.getElementById(id).value = '');
  document.getElementById('fAvailClass').value = 'avail-yes';
  document.getElementById('fBadgeClass').value = '';
  document.getElementById('formTitle').textContent = 'Add a New Car';
  document.getElementById('cancelEditBtn').style.display = 'none';
}

document.getElementById('cancelEditBtn').addEventListener('click', clearForm);

async function loadCarsTable() {
  const { data, error } = await supabaseClient.from('cars').select('*').order('id', { ascending: true });
  if (error) { showMsg('formMsg', 'Could not load cars: ' + error.message, 'error'); return; }

  const tbody = document.getElementById('carsTableBody');
  tbody.innerHTML = data.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.type || ''}</td>
      <td>PKR ${Number(c.hourly_rate).toLocaleString()}</td>
      <td>${c.avail}</td>
      <td class="actions">
        <button class="secondary" onclick="editCar(${c.id})">Edit</button>
        <button class="danger" onclick="deleteCar(${c.id})">Delete</button>
      </td>
    </tr>
  `).join('');

  window._carsCache = data; // used by editCar()
}

document.getElementById('saveBtn').addEventListener('click', async () => {
  const id = document.getElementById('carId').value;

  const payload = {
    name: document.getElementById('fName').value.trim(),
    type: document.getElementById('fType').value.trim(),
    hourly_rate: parseFloat(document.getElementById('fRate').value) || 0,
    rating: parseFloat(document.getElementById('fRating').value) || 5,
    popular: parseInt(document.getElementById('fPopular').value) || 0,
    avail: document.getElementById('fAvail').value.trim() || 'Available',
    avail_class: document.getElementById('fAvailClass').value,
    badge: document.getElementById('fBadge').value.trim() || null,
    badge_class: document.getElementById('fBadgeClass').value || null,
    fuel: document.getElementById('fFuel').value.trim(),
    seats: document.getElementById('fSeats').value.trim(),
    ac: document.getElementById('fAc').value.trim(),
    music: document.getElementById('fMusic').value.trim(),
    cat: csvToArray(document.getElementById('fCat').value),
    feats: csvToArray(document.getElementById('fFeats').value),
    image: csvToArray(document.getElementById('fImage').value),
    description: document.getElementById('fDesc').value.trim()
  };

  if (!payload.name) { showMsg('formMsg', 'Car name is required', 'error'); return; }

  let error;
  if (id) {
    ({ error } = await supabaseClient.from('cars').update(payload).eq('id', id));
  } else {
    ({ error } = await supabaseClient.from('cars').insert(payload));
  }

  if (error) {
    showMsg('formMsg', 'Save failed: ' + error.message, 'error');
  } else {
    showMsg('formMsg', id ? 'Car updated ✓' : 'Car added ✓', 'success');
    clearForm();
    loadCarsTable();
  }
});

function editCar(id) {
  const c = window._carsCache.find(x => x.id === id);
  if (!c) return;
  document.getElementById('carId').value = c.id;
  document.getElementById('fName').value = c.name || '';
  document.getElementById('fType').value = c.type || '';
  document.getElementById('fRate').value = c.hourly_rate || '';
  document.getElementById('fRating').value = c.rating || '';
  document.getElementById('fPopular').value = c.popular || '';
  document.getElementById('fAvail').value = c.avail || '';
  document.getElementById('fAvailClass').value = c.avail_class || 'avail-yes';
  document.getElementById('fBadge').value = c.badge || '';
  document.getElementById('fBadgeClass').value = c.badge_class || '';
  document.getElementById('fFuel').value = c.fuel || '';
  document.getElementById('fSeats').value = c.seats || '';
  document.getElementById('fAc').value = c.ac || '';
  document.getElementById('fMusic').value = c.music || '';
  document.getElementById('fCat').value = (c.cat || []).join(', ');
  document.getElementById('fFeats').value = (c.feats || []).join(', ');
  document.getElementById('fImage').value = (c.image || []).join(', ');
  document.getElementById('fDesc').value = c.description || '';
  document.getElementById('formTitle').textContent = `Editing: ${c.name}`;
  document.getElementById('cancelEditBtn').style.display = 'inline-block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteCar(id) {
  if (!confirm('Delete this car permanently?')) return;
  const { error } = await supabaseClient.from('cars').delete().eq('id', id);
  if (error) {
    showMsg('formMsg', 'Delete failed: ' + error.message, 'error');
  } else {
    showMsg('formMsg', 'Car deleted', 'success');
    loadCarsTable();
  }
}

// expose for inline onclick handlers
window.editCar = editCar;
window.deleteCar = deleteCar;

checkSession();