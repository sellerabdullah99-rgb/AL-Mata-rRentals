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

async function uploadSelectedImages() {
  const fileInput = document.getElementById('fImageFiles');
  const files = fileInput.files;
  if (!files || !files.length) return [];

  const statusEl = document.getElementById('uploadStatus');
  const urls = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    statusEl.textContent = `Uploading image ${i + 1} of ${files.length}...`;

    const ext = file.name.split('.').pop();
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await supabaseClient.storage
      .from('car-images')
      .upload(safeName, file);

    if (uploadError) {
      throw new Error(`Upload failed for ${file.name}: ${uploadError.message}`);
    }

    const { data: pub } = supabaseClient.storage
      .from('car-images')
      .getPublicUrl(safeName);

    urls.push(pub.publicUrl);
  }

  statusEl.textContent = `✓ ${urls.length} image(s) uploaded.`;
  fileInput.value = ''; // clear the file picker
  return urls;
}

function clearForm() {
  ['carId','fName','fType','fRate','fRating','fPopular','fFeats','fImage','fDesc']
   .forEach(id => document.getElementById(id).value = '');
  document.getElementById('fAvail').value = 'Available';
  document.getElementById('fAvailClass').value = 'avail-yes';
  document.getElementById('fBadge').value = '';
  document.getElementById('fBadgeClass').value = '';
  document.getElementById('fFuel').value = 'Petrol';
  document.getElementById('fSeats').value = '5 Seats';
  document.getElementById('fAc').value = 'AC';
  document.getElementById('fMusic').value = 'Aux / BT';
  document.querySelectorAll('.catBox').forEach(cb => cb.checked = false);
  document.querySelector('.catBox[value="driver"]').checked = true;
  document.getElementById('fImageFiles').value = '';
  document.getElementById('uploadStatus').textContent = 'You can select multiple photos at once.';
  document.getElementById('formTitle').textContent = 'Add a New Car';
  document.getElementById('cancelEditBtn').style.display = 'none';
}

function getCheckedCats() {
  const checked = [...document.querySelectorAll('.catBox:checked')].map(cb => cb.value);
  return ['all', ...checked]; // 'all' is always included
}

function setCheckedCats(cats) {
  const list = cats || [];
  document.querySelectorAll('.catBox').forEach(cb => {
    cb.checked = list.includes(cb.value);
  });
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
        <button onclick="openInvoice(${c.id})">Invoice</button>

      </td>
    </tr>
  `).join('');

  window._carsCache = data; // used by editCar()
}

document.getElementById('saveBtn').addEventListener('click', async () => {
  const id = document.getElementById('carId').value;
  const saveBtn = document.getElementById('saveBtn');

  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving...';

  try {
    const uploadedUrls = await uploadSelectedImages();
    const typedUrls = csvToArray(document.getElementById('fImage').value);
    const allImages = [...typedUrls, ...uploadedUrls];

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
      cat: getCheckedCats(),
      feats: csvToArray(document.getElementById('fFeats').value),
      image: allImages,
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
  } catch (err) {
    showMsg('formMsg', err.message, 'error');
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Car';
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
  document.getElementById('fMusic').value = c.music || 'Aux / BT';
  setCheckedCats(c.cat || []);
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

// ---------- ONE-TIME: MIGRATE OLD LOCAL IMAGES TO STORAGE ----------

async function migrateLocalImages() {
  const logEl = document.getElementById('migrateLog');
  const btn = document.getElementById('migrateImagesBtn');
  btn.disabled = true;
  logEl.textContent = 'Loading cars...\n';

  const { data: cars, error } = await supabaseClient.from('cars').select('*');
  if (error) {
    logEl.textContent += `Could not load cars: ${error.message}\n`;
    btn.disabled = false;
    return;
  }

  for (const car of cars) {
    const oldImages = car.image || [];
    const newImages = [];
    let changed = false;

    for (const path of oldImages) {
      // Already a full URL (Supabase Storage or an external host like Google Drive) — leave as-is
      if (/^https?:\/\//i.test(path)) {
        newImages.push(path);
        continue;
      }

      logEl.textContent += `"${car.name}": fetching local file ${path} ...\n`;
      logEl.scrollTop = logEl.scrollHeight;

      try {
        const resp = await fetch(path);
        if (!resp.ok) throw new Error(`HTTP ${resp.status} — file not found on server`);
        const blob = await resp.blob();

        const extMatch = path.split('.').pop().split(/[?#]/)[0];
        const ext = extMatch && extMatch.length <= 5 ? extMatch : 'jpg';
        const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        const { error: upErr } = await supabaseClient.storage
          .from('car-images')
          .upload(safeName, blob, { contentType: blob.type || 'image/jpeg' });
        if (upErr) throw upErr;

        const { data: pub } = supabaseClient.storage.from('car-images').getPublicUrl(safeName);
        newImages.push(pub.publicUrl);
        changed = true;
        logEl.textContent += `  ✓ uploaded → ${pub.publicUrl}\n`;
      } catch (err) {
        logEl.textContent += `  ✗ skipped (${err.message}) — kept original path\n`;
        newImages.push(path); // don't lose the reference even if upload failed
      }
      logEl.scrollTop = logEl.scrollHeight;
    }

    if (changed) {
      const { error: updErr } = await supabaseClient.from('cars').update({ image: newImages }).eq('id', car.id);
      if (updErr) {
        logEl.textContent += `  ✗ could not save new URLs for "${car.name}": ${updErr.message}\n`;
      } else {
        logEl.textContent += `  ✓ database updated for "${car.name}"\n`;
      }
    } else {
      logEl.textContent += `"${car.name}": nothing to migrate.\n`;
    }
    logEl.scrollTop = logEl.scrollHeight;
  }

  logEl.textContent += '\nDone! Refresh the Current Fleet table below, and check your live site.\n';
  btn.disabled = false;
  loadCarsTable();
}

document.getElementById('migrateImagesBtn').addEventListener('click', migrateLocalImages);

checkSession();
// ---------- INVOICE ----------

let _invoiceCarId = null;
let _invMap = null;
let _invMarker = null;

function openInvoice(id) {
  const c = window._carsCache.find(x => x.id === id);
  if (!c) return;
  _invoiceCarId = id;

  document.getElementById('invCarName').textContent =
    `${c.name} — ${c.type || ''} — PKR ${Number(c.hourly_rate).toLocaleString()}/hr`;

  document.getElementById('invCustomerName').value = '';
  document.getElementById('invCustomerPhone').value = '';
  document.getElementById('invLocation').value = '';
  document.getElementById('invLat').value = '';
  document.getElementById('invLng').value = '';
  document.getElementById('invStart').value = '';
  document.getElementById('invHours').value = '';
  document.getElementById('invOwnerPhone').value = '';
  document.getElementById('invNotes').value = '';
  document.getElementById('invTotalBox').textContent = '';

  document.getElementById('invoiceOverlay').style.display = 'flex';

  // map needs the container to be visible before it can size itself correctly
  setTimeout(initInvoiceMap, 100);
}

function initInvoiceMap() {
  if (_invMarker) { _invMarker.remove(); _invMarker = null; }

  if (!_invMap) {
    // Default center: Lahore — change lat/lng below if your base city is different
    _invMap = L.map('invMap').setView([31.5204, 74.3587], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(_invMap);

    _invMap.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      placeInvoiceMarker(lat, lng);
      await reverseGeocode(lat, lng);
    });
  }

  // fix map sizing when it was rendered while hidden
  _invMap.invalidateSize();
}

function placeInvoiceMarker(lat, lng) {
  if (_invMarker) _invMarker.setLatLng([lat, lng]);
  else _invMarker = L.marker([lat, lng]).addTo(_invMap);
  document.getElementById('invLat').value = lat;
  document.getElementById('invLng').value = lng;
}

async function reverseGeocode(lat, lng) {
  const locInput = document.getElementById('invLocation');
  locInput.value = 'Looking up address...';
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await res.json();
    locInput.value = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch (err) {
    locInput.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`; // fallback: raw coordinates
  }
}

function closeInvoice() {
  document.getElementById('invoiceOverlay').style.display = 'none';
  _invoiceCarId = null;
}

function calcInvoiceTotal() {
  const c = window._carsCache.find(x => x.id === _invoiceCarId);
  const hours = parseFloat(document.getElementById('invHours').value) || 0;
  const total = (c ? Number(c.hourly_rate) : 0) * hours;
  document.getElementById('invTotalBox').textContent =
    hours ? `Total: PKR ${total.toLocaleString()} (${hours} hrs)` : '';
  return total;
}

document.getElementById('invHours').addEventListener('input', calcInvoiceTotal);
document.getElementById('invCloseBtn').addEventListener('click', closeInvoice);

function buildInvoiceNumber(carId) {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  return `ALM-${stamp}-${carId}-${Math.floor(Math.random()*900+100)}`;
}

document.getElementById('invGenerateBtn').addEventListener('click', () => {
  const c = window._carsCache.find(x => x.id === _invoiceCarId);
  if (!c) return;

  const customerName = document.getElementById('invCustomerName').value.trim() || '—';
  const customerPhone = document.getElementById('invCustomerPhone').value.trim() || '—';
  const location = document.getElementById('invLocation').value.trim() || '—';
  const lat = document.getElementById('invLat').value;
  const lng = document.getElementById('invLng').value;
  const mapLink = (lat && lng) ? `https://maps.google.com/?q=${lat},${lng}` : '';
  const start = document.getElementById('invStart').value || '—';
  const hours = document.getElementById('invHours').value || '0';
  const notes = document.getElementById('invNotes').value.trim();
  const total = calcInvoiceTotal();
  const invNo = buildInvoiceNumber(c.id);
  const today = new Date().toLocaleDateString();

  const w = window.open('', '_blank');
  w.document.write(`
    <html><head><title>Invoice ${invNo}</title>
    <style>
      body{font-family:system-ui,sans-serif;padding:40px;color:#111;}
      h1{color:#B8962E;margin-bottom:0;}
      .sub{color:#888;margin-top:4px;margin-bottom:24px;}
      table{width:100%;border-collapse:collapse;margin:20px 0;}
      td,th{padding:8px;border-bottom:1px solid #eee;text-align:left;font-size:.9rem;}
      .total{font-size:1.2rem;font-weight:700;color:#B8962E;}
    </style></head><body>
      <h1>AL-Matar Rentals</h1>
      <p class="sub">Invoice #${invNo} — ${today}</p>
      <table>
        <tr><th>Customer Name</th><td>${customerName}</td></tr>
        <tr><th>Customer Phone</th><td>${customerPhone}</td></tr>
        <tr><th>Pickup Location</th><td>${location}${mapLink ? ` — <a href="${mapLink}" target="_blank">View on map</a>` : ''}</td></tr>
        <tr><th>Rental Start</th><td>${start}</td></tr>
        <tr><th>Duration</th><td>${hours} hour(s)</td></tr>
        <tr><th>Car</th><td>${c.name} (${c.type || ''})</td></tr>
        <tr><th>Fuel / Seats / AC</th><td>${c.fuel || ''} / ${c.seats || ''} / ${c.ac || ''}</td></tr>
        <tr><th>Features</th><td>${(c.feats||[]).join(', ')}</td></tr>
        <tr><th>Rate</th><td>PKR ${Number(c.hourly_rate).toLocaleString()}/hr</td></tr>
        ${notes ? `<tr><th>Notes</th><td>${notes}</td></tr>` : ''}
      </table>
      <p class="total">Total: PKR ${total.toLocaleString()}</p>
      <script>window.print();</script>
    </body></html>
  `);
  w.document.close();
});

document.getElementById('invWhatsAppBtn').addEventListener('click', () => {
  const c = window._carsCache.find(x => x.id === _invoiceCarId);
  if (!c) return;

  const ownerPhone = document.getElementById('invOwnerPhone').value.trim().replace(/[^0-9]/g, '');
  if (!ownerPhone) { alert('Owner ka WhatsApp number likhein'); return; }

  const customerName = document.getElementById('invCustomerName').value.trim() || 'a customer';
  const customerPhone = document.getElementById('invCustomerPhone').value.trim() || '—';
  const location = document.getElementById('invLocation').value.trim() || '—';
  const lat = document.getElementById('invLat').value;
  const lng = document.getElementById('invLng').value;
  const mapLink = (lat && lng) ? `https://maps.google.com/?q=${lat},${lng}` : '';
  const start = document.getElementById('invStart').value || '—';
  const hours = document.getElementById('invHours').value || '0';
  const total = calcInvoiceTotal();

  const msg = `AL-Matar Rentals booking:\nCar: ${c.name}\nCustomer: ${customerName} (${customerPhone})\nLocation: ${location}${mapLink ? `\nMap: ${mapLink}` : ''}\nStart: ${start}\nDuration: ${hours} hrs\nTotal: PKR ${total.toLocaleString()}\nPlease confirm availability.`;

  const url = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
});

window.openInvoice = openInvoice;
