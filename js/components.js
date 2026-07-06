// ============================================
// AL-MATAR RENTALS — SHARED COMPONENTS (White/Pro)
// ============================================

function getNavbar(activePage = '') {
  return `
  <div class="announce" id="announce">
    <span>Limited-time offer: 15% off bookings of 3+ days. Code <strong>GULSHAN15</strong></span>
    <a href="booking.html">Book now →</a>
    <button onclick="document.getElementById('announce').remove()" style="background:none;border:none;color:rgba(255,255,255,0.6);cursor:pointer;font-size:1rem;margin-left:8px;">✕</button>
  </div>
  <nav class="navbar" id="navbar">
    <div class="container">
      <div class="navbar__inner">
        <a href="index.html" class="navbar__logo">AL-<span>Matar</span> <sub>Rentals</sub></a>
        <div class="navbar__search">
          <span class="navbar__search-icon">🔍</span>
          <input type="text" id="searchInput" placeholder="Search cars..." autocomplete="off"/>
          <div class="navbar__search-drop" id="searchDrop"></div>
        </div>
        <button class="navbar__toggle" id="navToggle" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
        <ul class="navbar__links" id="navLinks">
          <li><a href="index.html" ${activePage==='home'?'class="active"':''}>Home</a></li>
          <li><a href="fleet.html" ${activePage==='fleet'?'class="active"':''}>Fleet</a></li>
          <li><a href="booking.html" ${activePage==='booking'?'class="active"':''}>Book a Car</a></li>
          <li><a href="about.html" ${activePage==='about'?'class="active"':''}>About</a></li>
          <li><a href="areas.html" ${activePage==='areas'?'class="active"':''}>Areas</a></li>
          <li><a href="contact.html" ${activePage==='contact'?'class="active"':''}>Contact</a></li>
          <li><a href="booking.html" class="navbar__cta">Book Now</a></li>
        </ul>
      </div>
    </div>
  </nav>`;
}

function getFooter() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <a href="index.html" class="footer__logo">AL-<span>Matar</span></a>
          <p class="footer__desc">Karachi's most trusted car rental — based in Gulshan Iqbal, serving the entire city and beyond with verified vehicles, professional drivers and transparent pricing.</p>
          <div class="footer__badges">
            <span class="footer__badge">4.9/5 rated by clients</span>
            <span class="footer__badge">Gulshan Iqbal's #1 rental</span>
            <span class="footer__badge">Fully insured fleet</span>
            <span class="footer__badge">50+ cars available</span>
          </div>
        </div>
        <div class="footer__col">
          <h4>Our Fleet</h4>
          <a href="fleet.html">Economy Cars</a>
          <a href="fleet.html">Sedan Cars</a>
          <a href="fleet.html">SUV & 4x4</a>
          <a href="fleet.html">Luxury Cars</a>
          <a href="fleet.html">Cars With Driver</a>
        </div>
        <div class="footer__col">
          <h4>Quick Links</h4>
          <a href="booking.html">Book a Car</a>
          <a href="booking.html#calculator">Price Calculator</a>
          <a href="about.html">About Us</a>
          <a href="areas.html">Areas We Cover</a>
          <a href="contact.html">Contact Us</a>
        </div>
        <div class="footer__col">
          <h4>Areas</h4>
          <a href="areas.html">Gulshan Iqbal (HQ)</a>
          <a href="areas.html">DHA Karachi</a>
          <a href="areas.html">Clifton</a>
          <a href="areas.html">North Nazimabad</a>
          <a href="areas.html">Airport Pickup</a>
          <a href="areas.html">Outstation Trips</a>
        </div>
        <div class="footer__col">
          <h4>Contact</h4>
          <a href="https://wa.me/923412372227" target="_blank">WhatsApp Us</a>
          <a href="tel:+923412372227">0341-2372227</a>
          <a href="mailto:info@almatar.pk">info@almatar.pk</a>
          <a href="areas.html">Gulshan Iqbal, Karachi</a>
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
        </div>
      </div>
      <div class="footer__bottom">
        <p>© 2025 AL-Matar Rentals. All rights reserved. | Gulshan Iqbal, Karachi, Pakistan</p>
        <div class="footer__bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">Refund Policy</a>
        </div>
      </div>
    </div>
  </footer>
  <a href="https://wa.me/923412372227?text=Assalamualaikum!%20I%20want%20to%20book%20a%20car%20from%20AL-Matar%20Rental." class="wa-float" target="_blank" title="Chat on WhatsApp">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
  </a>
  <button class="scroll-top" id="scrollTop" title="Back to top">↑</button>`;
}
