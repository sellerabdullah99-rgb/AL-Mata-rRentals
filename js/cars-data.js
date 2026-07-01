// ============================================
// AL-MATAR RENTALS — CAR DATA (baked in, no fetch needed)
// Works on file:// protocol — no local server required
//
// PRICING MODEL: With-driver only. hourlyRate × package hours = price.
// Packages offered: 5hr, 10hr, 12hr, 20hr, 24hr (full day).
// hourlyRate values below are PLACEHOLDERS — replace with real client rates.
// ============================================

const CARS_DATA = [
  {
    "id": 1,
    "name": "Toyota Corolla",
    "type": "Sedan",
    "image": ["/images/car1/toyota-corolla-Altis.jpeg",

    ],
    "rating": 4.9,
    "avail": "Available",
    "availClass": "avail-yes",
    "badge": "Most Popular",
    "badgeClass": "badge-blue",
    "cat": [
      "all",
      "sedan",
      "driver"
    ],
    "popular": 10,
    "fuel": "Petrol",
    "seats": "5 Seats",
    "ac": "AC",
    "music": "Aux / BT",
    "feats": [
      "Driver included",
      "City commutes",
      "Free cancellation",
      "Fuel efficient"
    ],
    "desc": "Karachi's most popular budget car. Fuel-efficient, fully AC, perfect for daily city commutes in Gulshan Iqbal and across Karachi.",
    "hourlyRate": 350
  },
  {
    "id": 2,
    "name": "Toyota Corolla Land-Cruiser",
    "type": "Sedan",
    "image": [
      "/images/car3/land-cruiser.jpeg"
    ],
    "rating": 4.8,
    "avail": "Available",
    "availClass": "avail-yes",
    "badge": "",
    "badgeClass": "",
    "cat": [
      "all",
      "sedan",
      "driver"
    ],
    "popular": 8,
    "fuel": "Petrol",
    "seats": "5 Seats",
    "ac": "AC",
    "music": "Sound System",
    "feats": [
      "Driver included",
      "Long trips",
      "Airport pickup",
      "Family trips"
    ],
    "desc": "Pakistan's most trusted sedan. Comfortable and reliable for family trips, corporate travel, and outstation journeys across Pakistan.",
    "hourlyRate": 600
  },
  {
    "id": 3,
    "name": "Honda City",
    "type": "Sedan",
    "image": "/images/car2/car-img.jpeg",
    "rating": 4.7,
    "avail": "Available",
    "availClass": "avail-yes",
    "badge": "",
    "badgeClass": "",
    "cat": [
      "all",
      "sedan",
      "driver"
    ],
    "popular": 7,
    "fuel": "Petrol",
    "seats": "5 Seats",
    "ac": "AC",
    "music": "Sound System",
    "feats": [
      "Driver included",
      "City trips",
      "Comfortable ride"
    ],
    "desc": "Stylish and comfortable sedan ideal for daily commutes and city drives across Karachi. Smooth ride, great fuel economy.",
    "hourlyRate": 650
  },
  {
    "id": 4,
    "name": "Haval Jolion",
    "type": "Sedan",
    "image": "/images/car4/car.jpeg",
    "rating": 4.9,
    "avail": "Available",
    "availClass": "avail-yes",
    "badge": "Hot",
    "badgeClass": "badge-blue",
    "cat": [
      "all",
      "sedan",
      "driver"
    ],
    "popular": 9,
    "fuel": "Petrol",
    "seats": "5 Seats",
    "ac": "Premium AC",
    "music": "Premium Audio",
    "feats": [
      "Driver included",
      "Sporty look",
      "Events & weddings",
      "Premium interior"
    ],
    "desc": "Sleek sporty sedan that turns heads. Perfect for weddings, events, and corporate travel. Comes with premium audio and interior.",
    "hourlyRate": 750
  },
  {
    "id": 5,
    "name": "Hyundai Tucson",
    "type": "SUV",
    "image": "/images/car5/car.jpeg",
    "rating": 4.9,
    "avail": "Available",
    "availClass": "avail-yes",
    "badge": "Premium",
    "badgeClass": "badge-gold",
    "cat": [
      "all",
      "suv",
      "driver"
    ],
    "popular": 6,
    "fuel": "Petrol",
    "seats": "5 Seats",
    "ac": "Dual AC",
    "music": "Camera + Screen",
    "feats": [
      "Driver included",
      "Family & outstation",
      "Backup camera",
      "Touch screen"
    ],
    "desc": "Modern SUV with premium features \u2014 backup camera, touchscreen, dual AC. Perfect for family outings and highway travel.",
    "hourlyRate": 1100
  },
  {
    "id": 6,
    "name": "Toyota Fortuner",
    "type": "SUV",
    "image":"/images/car6/car.jpeg",
    "rating": 5.0,
    "avail": "Available",
    "availClass": "avail-yes",
    "badge": "Top Pick",
    "badgeClass": "badge-gold",
    "cat": [
      "all",
      "suv",
      "driver"
    ],
    "popular": 5,
    "fuel": "Diesel",
    "seats": "7 Seats",
    "ac": "Dual AC",
    "music": "Camera + Screen",
    "feats": [
      "Driver included",
      "Corporate & trips",
      "7-seater",
      "Highway king"
    ],
    "desc": "The go-to 7-seater SUV for large families and corporate groups. Powerful diesel engine conquers outstation trips effortlessly.",
    "hourlyRate": 1300
  },
  {
    "id": 7,
    "name": "Toyota Prado",
    "type": "Luxury SUV",
    "image": "/images/car7/car.jpeg",
    "rating": 5.0,
    "avail": "Available",
    "availClass": "avail-yes",
    "badge": "Luxury",
    "badgeClass": "badge-black",
    "cat": [
      "all",
      "luxury",
      "suv",
      "driver"
    ],
    "popular": 4,
    "fuel": "Diesel",
    "seats": "7 Seats",
    "ac": "Dual AC",
    "music": "Sunroof + Screen",
    "feats": [
      "Driver included",
      "Chauffeur available",
      "VIP events",
      "Sunroof",
      "Premium leather"
    ],
    "desc": "Pure luxury for VIP occasions, weddings, and business executives. Sunroof, premium leather, chauffeur-driven for maximum comfort.",
    "hourlyRate": 1900
  },
  {
    "id": 8,
    "name": "Land Cruiser V8",
    "type": "Luxury SUV",
    "image": "https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=600&q=80&auto=format&fit=crop",
    "rating": 5.0,
    "avail": "Limited",
    "availClass": "avail-few",
    "badge": "Ultra Luxury",
    "badgeClass": "badge-black",
    "cat": [
      "all",
      "luxury",
      "driver"
    ],
    "popular": 3,
    "fuel": "Petrol V8",
    "seats": "8 Seats",
    "ac": "Dual AC",
    "music": "Sunroof + Screen",
    "feats": [
      "Driver included",
      "Chauffeur included",
      "Weddings & VIP",
      "8-seater",
      "V8 Power"
    ],
    "desc": "The pinnacle of luxury travel in Pakistan. Perfect for VIP delegates, high-profile events and weddings. Chauffeur always included.",
    "hourlyRate": 2600
  }
];
