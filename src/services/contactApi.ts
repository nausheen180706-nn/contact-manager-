import { Contact, ContactFormData } from '../types/contact';
import { INITIAL_CONTACTS, AVATAR_COLORS } from '../data/mockContacts';

/**
 * ============================================================================
 * FULL STACK WEBINAR PREPARATION NOTE:
 * ============================================================================
 * In production, you will connect this service to your Node.js + Express backend:
 * 
 * const API_BASE_URL = 'http://localhost:5000/api/contacts';
 * 
 * For this webinar demonstration, we simulate REST API network requests with
 * async Promises and browser storage. When your backend is ready, simply
 * swap the simulated logic with fetch() or axios calls shown in the comments!
 * ============================================================================
 */

// Toggle this or change API_BASE_URL when connecting your real Express server!
export const API_BASE_URL = 'http://localhost:5000/api/contacts';

const STORAGE_KEY = 'contact_manager_demo_contacts';

// Initialize in-memory or localStorage state
const loadInitialContacts = (): Contact[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read from localStorage, using initial mock data', err);
  }
  return [...INITIAL_CONTACTS];
};

let localContacts: Contact[] = loadInitialContacts();

const persistContacts = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localContacts));
  } catch (err) {
    console.warn('Could not save to localStorage', err);
  }
};

// Simulated network latency (150ms) to give realistic async feel during demonstration
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * GET /api/contacts
 * Retrieve all contacts from the database
 */
export async function getContacts(): Promise<Contact[]> {
  await delay(120);

  /*
  // WEBINAR INTEGRATION STEP:
  // const response = await fetch(API_BASE_URL);
  // if (!response.ok) throw new Error('Failed to fetch contacts');
  // return await response.json();
  */

  return [...localContacts];
}

/**
 * POST /api/contacts
 * Create a new contact document
 */
export async function createContact(contactData: ContactFormData): Promise<Contact> {
  await delay(200);

  /*
  // WEBINAR INTEGRATION STEP:
  // const response = await fetch(API_BASE_URL, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(contactData),
  // });
  // if (!response.ok) throw new Error('Failed to create contact');
  // return await response.json();
  */

  // Generate random avatar color and simulated MongoDB ObjectId format
  const colorIndex = localContacts.length % AVATAR_COLORS.length;
  const newContact: Contact = {
    id: `c_${Date.now().toString(16)}${Math.random().toString(16).substring(2, 6)}`,
    name: contactData.name.trim(),
    email: contactData.email.trim().toLowerCase(),
    phone: contactData.phone.trim(),
    createdAt: new Date().toISOString(),
    status: 'active',
    avatarBg: AVATAR_COLORS[colorIndex]
  };

  // Add to top of list
  localContacts = [newContact, ...localContacts];
  persistContacts();

  return newContact;
}

/**
 * PUT /api/contacts/:id
 * Update an existing contact document
 */
export async function updateContact(id: string, contactData: ContactFormData): Promise<Contact> {
  await delay(180);

  /*
  // WEBINAR INTEGRATION STEP:
  // const response = await fetch(`${API_BASE_URL}/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(contactData),
  // });
  // if (!response.ok) throw new Error('Failed to update contact');
  // return await response.json();
  */

  const index = localContacts.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Contact with ID ${id} not found`);
  }

  const updated: Contact = {
    ...localContacts[index],
    name: contactData.name.trim(),
    email: contactData.email.trim().toLowerCase(),
    phone: contactData.phone.trim()
  };

  localContacts[index] = updated;
  persistContacts();

  return updated;
}

/**
 * DELETE /api/contacts/:id
 * Remove a contact document from database
 */
export async function deleteContact(id: string): Promise<{ success: boolean; id: string }> {
  await delay(160);

  /*
  // WEBINAR INTEGRATION STEP:
  // const response = await fetch(`${API_BASE_URL}/${id}`, {
  //   method: 'DELETE',
  // });
  // if (!response.ok) throw new Error('Failed to delete contact');
  // return await response.json();
  */

  const index = localContacts.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Contact with ID ${id} not found`);
  }

  localContacts = localContacts.filter((c) => c.id !== id);
  persistContacts();

  return { success: true, id };
}

/**
 * Helper to restore original demo contacts
 */
export async function resetToDefaultContacts(): Promise<Contact[]> {
  await delay(100);
  localContacts = [...INITIAL_CONTACTS];
  persistContacts();
  return [...localContacts];
}
