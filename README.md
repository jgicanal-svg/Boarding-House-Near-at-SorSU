# Sorsogon State University – Bulan Campus Boarding House Verification & Student Accommodation System

A production-ready, full-stack web application designed for students, parents, property owners, and university verifiers at **Sorsogon State University (SSU) Bulan Campus**.

---

## 🚀 Key Features

1. **Verified Boarding House Directory & Persistent Filters**:
   - Filter by price ranges (with dual sliders and quick budget presets).
   - Filter by number of available beds / capacity.
   - Filter by walking distance proximity to SSU Bulan Campus gate (500m, 1km, 2km).
   - Multi-select amenity filters (Wi-Fi, Water Included, Kitchen Access, Study Area, Aircon, Private Bathroom, Laundry Area, CCTV Security).
   - Barangay/Zone filters (Zone VIII Poblacion, Santa Remedios, Obrero, ManagaNaga, Libertad).

2. **Interactive Leaflet.js Maps & Marker Clustering**:
   - Interactive map view with custom pins near SSU Bulan Campus.
   - Marker clustering (`leaflet.markercluster`) to prevent overlapping icons in high-density zones.
   - Map layer switcher (Standard, Grayscale, Satellite).

3. **Student Reviews & Star Ratings**:
   - Star rating distribution, verified student badges, and detailed review submission.

4. **Side-by-Side Comparison**:
   - Compare up to 3 boarding houses simultaneously (price, status, owner, distance, facilities).

5. **Role-Based Portals & Authentication**:
   - **Student Portal**: Save favorites, contact owners via direct Facebook Messenger links, view messages/viewings.
   - **Landlord/Owner Portal**: Submit new boarding house listings for barangay verification, manage room availability.
   - **Verifier/Admin Portal**: Review inspection checklists, verify or reject properties, access admin moderation queues.
   - **Zod Schema Validation**: Robust form validation and password strength requirements on all login pages with show/hide password toggles.

6. **Global Dark & Light Mode**:
   - Co-optimized dark and light mode styling across all pages, modals, tables, and maps.

---

## 👥 Demo Accounts

| Role | Email | Password | Access & Features |
| :--- | :--- | :--- | :--- |
| **Student** | `student@ssubulan.edu.ph` | `student123` | Browse verified listings, bookmark favorites, rate & review properties, compare listings. |
| **Landlord / Owner** | `owner@ssubulan.edu.ph` | `owner123` | Submit new boarding house listings for verification, update room availability. |
| **Verifier / Admin** | `verifier@ssubulan.edu.ph` | `verifier123` | Access Verifier Dashboard, review inspection checklists, verify/reject properties. |

---

## 🛠️ Tech Stack

- **Frontend**: React (SPA) with Vite, TypeScript, Tailwind CSS v4, Lucide React icons, Motion.
- **Maps**: Leaflet.js, React-Leaflet, Leaflet Markercluster.
- **Backend**: Node.js & Express API server.
- **Validation**: Zod schema validation.

---

## 🏃 Getting Started & Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```
