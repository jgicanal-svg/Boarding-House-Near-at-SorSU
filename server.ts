import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface Owner {
  id: string;
  name: string;
  email: string;
  contact_information: string;
  messenger_url: string;
  created_at: string;
}

interface Listing {
  id: string;
  owner_id: string;
  verified_by?: string;
  name: string;
  description: string;
  monthly_price: number;
  address: string;
  latitude: number;
  longitude: number;
  facilities: string[];
  status: 'AWAITING_VERIFICATION' | 'VERIFIED' | 'REJECTED' | 'RESERVED' | 'TAKEN' | 'EXPIRED';
  rejection_reason?: string;
  submitted_at: string;
  verified_at?: string;
  updated_at: string;
  photos: string[];
  owner: Owner;
  verification_checklist?: {
    price_checked: boolean;
    photos_checked: boolean;
    availability_checked: boolean;
    notes: string;
    verifier_name: string;
    created_at: string;
  };
}

interface Inquiry {
  id: string;
  listing_id: string;
  student_email?: string;
  message?: string;
  created_at: string;
}

// Seed owners with emails for login
let owners: Owner[] = [
  {
    id: 'owner-1',
    name: 'Aling Maria Gicanal',
    email: 'maria@bulanowner.com',
    contact_information: '09123456789',
    messenger_url: 'https://m.me/maria.gicanal.boarding',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'owner-2',
    name: 'Mang Juanico Estreller',
    email: 'juanico@bulanowner.com',
    contact_information: '09187654321',
    messenger_url: 'https://m.me/juanico.estreller',
    created_at: new Date(Date.now() - 25 * 86400000).toISOString()
  },
  {
    id: 'owner-3',
    name: 'Bulan Student Housing Corp',
    email: 'corp@bulanowner.com',
    contact_information: '09198887766',
    messenger_url: 'https://m.me/bulanstudenthousing',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  {
    id: 'owner-4',
    name: 'Rosa Habagat',
    email: 'rosa@bulanowner.com',
    contact_information: '09154443322',
    messenger_url: 'https://m.me/rosa.habagat',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

let listings: Listing[] = [
  {
    id: 'list-1',
    owner_id: 'owner-1',
    verified_by: 'Verifier Engr. Technologia',
    name: 'Bulan Sunrise Dormitory & Bedspace',
    description: 'Very peaceful boarding house located just 5 minutes walk from Sorsogon State University - Bulan Campus. Features well-lit study rooms, reliable Wi-Fi, own submeters, and secure perimeter fence with CCTV.',
    monthly_price: 1500,
    address: 'Zone VIII Poblacion (Barangay 8 - Loyo), Bulan, Sorsogon',
    latitude: 12.6718,
    longitude: 123.8728,
    facilities: ['Wi-Fi', 'Water Included', 'Kitchen Access', 'Study Area', 'CCTV Security', 'Bicycle Parking'],
    status: 'VERIFIED',
    submitted_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    verified_at: new Date(Date.now() - 19 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    photos: [
      '/src/assets/images/student_room_interior_1793166105502.jpg',
      '/src/assets/images/bulan_boarding_hero_1793166105471.jpg'
    ],
    owner: owners[0],
    verification_checklist: {
      price_checked: true,
      photos_checked: true,
      availability_checked: true,
      notes: 'Personally inspected by verifier on site. Price matches student budget. Clean rooms and compliant fire safety exits.',
      verifier_name: 'Engr. Technologia (Lead Verifier)',
      created_at: new Date(Date.now() - 19 * 86400000).toISOString()
    }
  },
  {
    id: 'list-2',
    owner_id: 'owner-2',
    verified_by: 'Verifier Engr. Technologia',
    name: 'Collegiate Haven Private Room',
    description: 'Spacious furnished room with private bathroom, study table, bed, and wardrobe. Ideal for senior students or group sharing (up to 3 persons). Walking distance to SSU Bulan campus main gate.',
    monthly_price: 2500,
    address: 'Santa Remedios, Bulan, Sorsogon',
    latitude: 12.6740,
    longitude: 123.8680,
    facilities: ['Aircon', 'Private Bathroom', 'Wi-Fi', 'Laundry Area', 'Kitchen Access'],
    status: 'VERIFIED',
    submitted_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    verified_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    photos: [
      '/src/assets/images/bulan_boarding_hero_1793166105471.jpg',
      '/src/assets/images/student_room_interior_1793166105502.jpg'
    ],
    owner: owners[1],
    verification_checklist: {
      price_checked: true,
      photos_checked: true,
      availability_checked: true,
      notes: 'Verified aircon unit and water supply. Owner agreed to standard student contract terms.',
      verifier_name: 'Engr. Technologia (Lead Verifier)',
      created_at: new Date(Date.now() - 14 * 86400000).toISOString()
    }
  },
  {
    id: 'list-3',
    owner_id: 'owner-3',
    verified_by: 'Verifier Prof. Sorsu',
    name: 'SSU Scholars Lodge & Boarding',
    description: 'Affordable bedspace for male and female students of SSU Bulan Campus. Quiet study environment, strict curfew for safety, free mineral drinking water, and spacious laundry area.',
    monthly_price: 1200,
    address: 'Obrero, Bulan, Sorsogon',
    latitude: 12.6680,
    longitude: 123.8760,
    facilities: ['Water Included', 'Study Area', 'Laundry Area', 'Security Guard'],
    status: 'VERIFIED',
    submitted_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    verified_at: new Date(Date.now() - 9 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    photos: [
      '/src/assets/images/student_room_interior_1793166105502.jpg'
    ],
    owner: owners[2],
    verification_checklist: {
      price_checked: true,
      photos_checked: true,
      availability_checked: true,
      notes: 'Very budget-friendly for working scholars. Checked bed spacing and ventilation.',
      verifier_name: 'Prof. Sorsu',
      created_at: new Date(Date.now() - 9 * 86400000).toISOString()
    }
  },
  {
    id: 'list-4',
    owner_id: 'owner-4',
    verified_by: 'Verifier Engr. Technologia',
    name: 'Bulan Bay Student Apartment (Reserved)',
    description: 'Modern 2-bedroom apartment unit available for nursing or education students of Sorsogon State University. Complete with kitchen and dining set.',
    monthly_price: 3200,
    address: 'ManagaNaga, Bulan, Sorsogon',
    latitude: 12.6790,
    longitude: 123.8610,
    facilities: ['Kitchen Access', 'Private Bathroom', 'Wi-Fi', 'Parking', 'Aircon'],
    status: 'RESERVED',
    submitted_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    verified_at: new Date(Date.now() - 11 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    photos: [
      '/src/assets/images/bulan_boarding_hero_1793166105471.jpg'
    ],
    owner: owners[3],
    verification_checklist: {
      price_checked: true,
      photos_checked: true,
      availability_checked: true,
      notes: 'Currently reserved for incoming 1st year education student.',
      verifier_name: 'Engr. Technologia (Lead Verifier)',
      created_at: new Date(Date.now() - 11 * 86400000).toISOString()
    }
  },
  {
    id: 'list-5',
    owner_id: 'owner-1',
    name: 'Gicanal Annex Dormitory',
    description: 'Newly constructed boarding rooms right behind SSU Bulan Campus gate. Brand new beds and study desks.',
    monthly_price: 1800,
    address: 'Zone VIII Poblacion (Barangay 8 - Loyo), Bulan, Sorsogon',
    latitude: 12.6715,
    longitude: 123.8725,
    facilities: ['Wi-Fi', 'Water Included', 'Kitchen Access', 'Study Area'],
    status: 'AWAITING_VERIFICATION',
    submitted_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    photos: [
      '/src/assets/images/student_room_interior_1793166105502.jpg'
    ],
    owner: owners[0]
  },
  {
    id: 'list-6',
    owner_id: 'owner-2',
    name: 'Estreller Transient House',
    description: 'House for rent in Libertad area, suitable for graduating students doing thesis projects.',
    monthly_price: 2800,
    address: 'Libertad, Bulan, Sorsogon',
    latitude: 12.6630,
    longitude: 123.8830,
    facilities: ['Kitchen Access', 'Laundry Area'],
    status: 'REJECTED',
    rejection_reason: 'Location is too far from SSU Bulan Campus (more than 2.0 km) and lacks required student safety lighting along the pathway.',
    submitted_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    photos: [
      '/src/assets/images/bulan_boarding_hero_1793166105471.jpg'
    ],
    owner: owners[1]
  }
];

let inquiries: Inquiry[] = [];

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  
  app.get('/api/listings', (req, res) => {
    const { status, search, min_price, max_price, facility, zone, owner_id } = req.query;
    
    let result = [...listings];

    if (owner_id) {
      result = result.filter(l => l.owner_id === owner_id);
      return res.json(result);
    }

    if (status) {
      result = result.filter(l => l.status === status);
    } else {
      result = result.filter(l => l.status === 'VERIFIED' || l.status === 'RESERVED' || l.status === 'TAKEN');
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(l => l.name.toLowerCase().includes(q) || l.address.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
    }

    if (min_price) {
      const min = Number(min_price);
      result = result.filter(l => l.monthly_price >= min);
    }

    if (max_price) {
      const max = Number(max_price);
      result = result.filter(l => l.monthly_price <= max);
    }

    if (facility && typeof facility === 'string') {
      result = result.filter(l => l.facilities.includes(facility));
    }

    if (zone && typeof zone === 'string') {
      result = result.filter(l => l.address.toLowerCase().includes(zone.toLowerCase()));
    }

    res.json(result);
  });

  app.get('/api/listings/:id', (req, res) => {
    const listing = listings.find(l => l.id === req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  });

  app.post('/api/listings', (req, res) => {
    const { owner_id, owner_name, contact_information, messenger_url, name, description, monthly_price, address, latitude, longitude, facilities, photos } = req.body;

    let targetOwner: Owner;
    if (owner_id) {
      const existing = owners.find(o => o.id === owner_id);
      if (existing) {
        targetOwner = existing;
      } else {
        return res.status(404).json({ error: 'Owner not found' });
      }
    } else {
      if (!name || !monthly_price || !address || !owner_name || !contact_information) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const ownerId = `owner-${Date.now()}`;
      targetOwner = {
        id: ownerId,
        name: owner_name,
        email: `${owner_name.toLowerCase().replace(/\s+/g, '')}@bulanowner.com`,
        contact_information,
        messenger_url: messenger_url || '',
        created_at: new Date().toISOString()
      };
      owners.push(targetOwner);
    }

    const newListing: Listing = {
      id: `list-${Date.now()}`,
      owner_id: targetOwner.id,
      name,
      description: description || '',
      monthly_price: Number(monthly_price),
      address,
      latitude: latitude ? Number(latitude) : 12.6712,
      longitude: longitude ? Number(longitude) : 123.8721,
      facilities: Array.isArray(facilities) ? facilities : [],
      status: 'AWAITING_VERIFICATION',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      photos: Array.isArray(photos) && photos.length > 0 ? photos : ['/src/assets/images/student_room_interior_1793166105502.jpg'],
      owner: targetOwner
    };

    listings.push(newListing);
    res.status(201).json(newListing);
  });

  app.post('/api/listings/:id/resubmit', (req, res) => {
    const listing = listings.find(l => l.id === req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const { name, description, monthly_price, address, facilities, photos } = req.body;
    if (name) listing.name = name;
    if (description) listing.description = description;
    if (monthly_price) listing.monthly_price = Number(monthly_price);
    if (address) listing.address = address;
    if (facilities) listing.facilities = facilities;
    if (photos && photos.length > 0) listing.photos = photos;

    listing.status = 'AWAITING_VERIFICATION';
    listing.rejection_reason = undefined;
    listing.updated_at = new Date().toISOString();

    res.json(listing);
  });

  app.post('/api/inquiries', (req, res) => {
    const { listing_id, message, student_email } = req.body;
    const listing = listings.find(l => l.id === listing_id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const inquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      listing_id,
      student_email,
      message,
      created_at: new Date().toISOString()
    };
    inquiries.push(inquiry);
    res.status(201).json({ success: true, inquiry, messenger_url: listing.owner.messenger_url });
  });

  // Auth logins
  app.post('/api/auth/login', (req, res) => {
    const { email, password, role } = req.body;

    if (role === 'VERIFIER' || email === 'verifier@sorsu.edu.ph') {
      if (email === 'verifier@sorsu.edu.ph' && password === 'password123') {
        return res.json({
          success: true,
          token: 'mock-verifier-jwt-token',
          user: { email, name: 'Engr. Technologia (Lead Verifier)', role: 'VERIFIER' }
        });
      } else {
        return res.status(401).json({ error: 'Invalid verifier credentials (verifier@sorsu.edu.ph / password123)' });
      }
    }

    const foundOwner = owners.find(o => o.email === email);
    if (role === 'OWNER' || foundOwner || email.includes('owner') || email.includes('bulanowner.com')) {
      const owner = foundOwner || {
        id: `owner-${Date.now()}`,
        name: email.split('@')[0],
        email,
        contact_information: '09123456789',
        messenger_url: 'https://m.me/sampleowner',
        created_at: new Date().toISOString()
      };
      if (!foundOwner) {
        owners.push(owner);
      }
      return res.json({
        success: true,
        token: `mock-owner-token-${owner.id}`,
        user: { id: owner.id, email: owner.email, name: owner.name, role: 'OWNER' }
      });
    }

    if (role === 'STUDENT' || email.includes('@sorsu.edu.ph') || email.includes('student')) {
      return res.json({
        success: true,
        token: 'mock-student-token',
        user: { email, name: email.split('@')[0], role: 'STUDENT' }
      });
    }

    res.status(401).json({ error: 'Invalid login credentials' });
  });

  app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }
    // Simulate secure recovery email dispatch
    res.json({
      success: true,
      message: `Secure recovery link has been dispatched to ${email}. Please check your inbox and spam folder.`
    });
  });

  app.post('/api/auth/reset-password', (req, res) => {
    const { email, new_password } = req.body;
    if (!email || !new_password) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }
    res.json({
      success: true,
      message: 'Password has been successfully updated. You may now sign in with your new credentials.'
    });
  });

  app.post('/api/reset-all', (req, res) => {
    owners = [
      {
        id: 'owner-1',
        name: 'Aling Maria Gicanal',
        email: 'maria@bulanowner.com',
        contact_information: '09123456789',
        messenger_url: 'https://m.me/maria.gicanal.boarding',
        created_at: new Date(Date.now() - 30 * 86400000).toISOString()
      },
      {
        id: 'owner-2',
        name: 'Mang Juanico Estreller',
        email: 'juanico@bulanowner.com',
        contact_information: '09187654321',
        messenger_url: 'https://m.me/juanico.estreller',
        created_at: new Date(Date.now() - 25 * 86400000).toISOString()
      },
      {
        id: 'owner-3',
        name: 'Bulan Student Housing Corp',
        email: 'corp@bulanowner.com',
        contact_information: '09198887766',
        messenger_url: 'https://m.me/bulanstudenthousing',
        created_at: new Date(Date.now() - 15 * 86400000).toISOString()
      },
      {
        id: 'owner-4',
        name: 'Rosa Habagat',
        email: 'rosa@bulanowner.com',
        contact_information: '09154443322',
        messenger_url: 'https://m.me/rosa.habagat',
        created_at: new Date(Date.now() - 5 * 86400000).toISOString()
      }
    ];

    listings = [
      {
        id: 'list-1',
        owner_id: 'owner-1',
        verified_by: 'Verifier Engr. Technologia',
        name: 'Bulan Sunrise Dormitory & Bedspace',
        description: 'Very peaceful boarding house located just 5 minutes walk from Sorsogon State University - Bulan Campus. Features well-lit study rooms, reliable Wi-Fi, own submeters, and secure perimeter fence with CCTV.',
        monthly_price: 1500,
        address: 'Zone VIII Poblacion (Barangay 8 - Loyo), Bulan, Sorsogon',
        latitude: 12.6718,
        longitude: 123.8728,
        facilities: ['Wi-Fi', 'Water Included', 'Kitchen Access', 'Study Area', 'CCTV Security', 'Bicycle Parking'],
        status: 'VERIFIED',
        submitted_at: new Date(Date.now() - 20 * 86400000).toISOString(),
        verified_at: new Date(Date.now() - 19 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        photos: [
          '/src/assets/images/student_room_interior_1793166105502.jpg',
          '/src/assets/images/bulan_boarding_hero_1793166105471.jpg'
        ],
        owner: owners[0],
        verification_checklist: {
          price_checked: true,
          photos_checked: true,
          availability_checked: true,
          notes: 'Personally inspected by verifier on site. Price matches student budget. Clean rooms and compliant fire safety exits.',
          verifier_name: 'Engr. Technologia (Lead Verifier)',
          created_at: new Date(Date.now() - 19 * 86400000).toISOString()
        }
      },
      {
        id: 'list-2',
        owner_id: 'owner-2',
        verified_by: 'Verifier Engr. Technologia',
        name: 'Collegiate Haven Private Room',
        description: 'Spacious furnished room with private bathroom, study table, bed, and wardrobe. Ideal for senior students or group sharing (up to 3 persons). Walking distance to SSU Bulan campus main gate.',
        monthly_price: 2500,
        address: 'Santa Remedios, Bulan, Sorsogon',
        latitude: 12.6740,
        longitude: 123.8680,
        facilities: ['Aircon', 'Private Bathroom', 'Wi-Fi', 'Laundry Area', 'Kitchen Access'],
        status: 'VERIFIED',
        submitted_at: new Date(Date.now() - 15 * 86400000).toISOString(),
        verified_at: new Date(Date.now() - 14 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
        photos: [
          '/src/assets/images/bulan_boarding_hero_1793166105471.jpg',
          '/src/assets/images/student_room_interior_1793166105502.jpg'
        ],
        owner: owners[1],
        verification_checklist: {
          price_checked: true,
          photos_checked: true,
          availability_checked: true,
          notes: 'Verified aircon unit and water supply. Owner agreed to standard student contract terms.',
          verifier_name: 'Engr. Technologia (Lead Verifier)',
          created_at: new Date(Date.now() - 14 * 86400000).toISOString()
        }
      },
      {
        id: 'list-3',
        owner_id: 'owner-3',
        verified_by: 'Verifier Prof. Sorsu',
        name: 'SSU Scholars Lodge & Boarding',
        description: 'Affordable bedspace for male and female students of SSU Bulan Campus. Quiet study environment, strict curfew for safety, free mineral drinking water, and spacious laundry area.',
        monthly_price: 1200,
        address: 'Obrero, Bulan, Sorsogon',
        latitude: 12.6680,
        longitude: 123.8760,
        facilities: ['Water Included', 'Study Area', 'Laundry Area', 'Security Guard'],
        status: 'VERIFIED',
        submitted_at: new Date(Date.now() - 10 * 86400000).toISOString(),
        verified_at: new Date(Date.now() - 9 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        photos: [
          '/src/assets/images/student_room_interior_1793166105502.jpg'
        ],
        owner: owners[2],
        verification_checklist: {
          price_checked: true,
          photos_checked: true,
          availability_checked: true,
          notes: 'Very budget-friendly for working scholars. Checked bed spacing and ventilation.',
          verifier_name: 'Prof. Sorsu',
          created_at: new Date(Date.now() - 9 * 86400000).toISOString()
        }
      },
      {
        id: 'list-4',
        owner_id: 'owner-4',
        verified_by: 'Verifier Engr. Technologia',
        name: 'Bulan Bay Student Apartment (Reserved)',
        description: 'Modern 2-bedroom apartment unit available for nursing or education students of Sorsogon State University. Complete with kitchen and dining set.',
        monthly_price: 3200,
        address: 'ManagaNaga, Bulan, Sorsogon',
        latitude: 12.6790,
        longitude: 123.8610,
        facilities: ['Kitchen Access', 'Private Bathroom', 'Wi-Fi', 'Parking', 'Aircon'],
        status: 'RESERVED',
        submitted_at: new Date(Date.now() - 12 * 86400000).toISOString(),
        verified_at: new Date(Date.now() - 11 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
        photos: [
          '/src/assets/images/bulan_boarding_hero_1793166105471.jpg'
        ],
        owner: owners[3],
        verification_checklist: {
          price_checked: true,
          photos_checked: true,
          availability_checked: true,
          notes: 'Currently reserved for incoming 1st year education student.',
          verifier_name: 'Engr. Technologia (Lead Verifier)',
          created_at: new Date(Date.now() - 11 * 86400000).toISOString()
        }
      }
    ];

    inquiries = [];

    res.json({ success: true, message: 'All accounts and application data have been successfully reset.' });
  });

  app.get('/api/verifier/stats', (req, res) => {
    const stats = {
      pending: listings.filter(l => l.status === 'AWAITING_VERIFICATION').length,
      verified: listings.filter(l => l.status === 'VERIFIED').length,
      rejected: listings.filter(l => l.status === 'REJECTED').length,
      reserved: listings.filter(l => l.status === 'RESERVED').length,
      taken: listings.filter(l => l.status === 'TAKEN').length,
      expired: listings.filter(l => l.status === 'EXPIRED').length,
      total_inquiries: inquiries.length
    };
    res.json(stats);
  });

  app.post('/api/verifier/listings/:id/review', (req, res) => {
    const { id } = req.params;
    const { action, price_checked, photos_checked, availability_checked, notes, rejection_reason, verifier_name } = req.body;

    const listing = listings.find(l => l.id === id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (action === 'APPROVE') {
      listing.status = 'VERIFIED';
      listing.verified_at = new Date().toISOString();
      listing.verified_by = verifier_name || 'Authorized Verifier SSU Bulan';
      listing.rejection_reason = undefined;
      listing.verification_checklist = {
        price_checked: Boolean(price_checked),
        photos_checked: Boolean(photos_checked),
        availability_checked: Boolean(availability_checked),
        notes: notes || 'Approved after physical inspection.',
        verifier_name: verifier_name || 'Authorized Verifier SSU Bulan',
        created_at: new Date().toISOString()
      };
    } else if (action === 'REJECT') {
      if (!rejection_reason) {
        return res.status(400).json({ error: 'Rejection reason is required when rejecting a listing' });
      }
      listing.status = 'REJECTED';
      listing.rejection_reason = rejection_reason;
      listing.verified_by = verifier_name || 'Authorized Verifier SSU Bulan';
      listing.verification_checklist = {
        price_checked: Boolean(price_checked),
        photos_checked: Boolean(photos_checked),
        availability_checked: Boolean(availability_checked),
        notes: notes || 'Rejected during verification review.',
        verifier_name: verifier_name || 'Authorized Verifier SSU Bulan',
        created_at: new Date().toISOString()
      };
    } else {
      return res.status(400).json({ error: 'Invalid review action' });
    }

    listing.updated_at = new Date().toISOString();
    res.json(listing);
  });

  app.patch('/api/verifier/listings/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['AWAITING_VERIFICATION', 'VERIFIED', 'REJECTED', 'RESERVED', 'TAKEN', 'EXPIRED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const listing = listings.find(l => l.id === id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    listing.status = status;
    listing.updated_at = new Date().toISOString();
    res.json(listing);
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
