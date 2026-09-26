import { Contact, ContactFormData, ContactStats } from '../types/contact';
import { AVATAR_COLORS } from '../data/mockContacts';

/**
 * ============================================================================
 * FULL STACK WEBINAR: REAL REST API CLIENT
 * ============================================================================
 * Communicates with the Express.js + MongoDB backend:
 * GET    /api/contacts
 * POST   /api/contacts
 * PUT    /api/contacts/:id
 * DELETE /api/contacts/:id
 * GET    /api/contacts/stats
 * PATCH  /api/contacts/:id/status
 * GET    /api/health
 * ============================================================================
 */

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

const CONTACTS_URL = `${API_BASE_URL}/contacts`;

// Helper to assign consistent avatar background color based on name/id
const formatContact = (item: any): Contact => {
  const id = item.id || item._id || '';
  const hash = (item.name || '').split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  const colorIndex = Math.abs(hash) % AVATAR_COLORS.length;

  return {
    id: id,
    _id: item._id || id,
    name: item.name || '',
    email: item.email || '',
    phone: item.phone || '',
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt,
    isActive: typeof item.isActive === 'boolean' ? item.isActive : true,
    status: item.isActive === false ? 'inactive' : 'active',
    avatarBg: item.avatarBg || AVATAR_COLORS[colorIndex]
  };
};

/**
 * Check backend health status
 * GET /api/health
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) return false;
    const json = await response.json();
    return json.success === true;
  } catch (error) {
    return false;
  }
}

/**
 * GET /api/contacts
 * Retrieve all contacts from MongoDB, sorted by newest first
 */
export async function getContacts(): Promise<Contact[]> {
  const response = await fetch(CONTACTS_URL);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch contacts from server');
  }

  const result = await response.json();
  const rawContacts = Array.isArray(result.data) ? result.data : [];
  return rawContacts.map(formatContact);
}

/**
 * GET /api/contacts/:id
 * Retrieve a single contact by MongoDB ID
 */
export async function getContactById(id: string): Promise<Contact> {
  const response = await fetch(`${CONTACTS_URL}/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch contact ${id}`);
  }

  const result = await response.json();
  return formatContact(result.data);
}

/**
 * GET /api/contacts?search=query
 * Search contacts by name, email, or phone
 */
export async function searchContacts(search: string): Promise<Contact[]> {
  const url = search.trim()
    ? `${CONTACTS_URL}?search=${encodeURIComponent(search.trim())}`
    : CONTACTS_URL;

  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to search contacts');
  }

  const result = await response.json();
  const rawContacts = Array.isArray(result.data) ? result.data : [];
  return rawContacts.map(formatContact);
}

/**
 * GET /api/contacts/stats
 * Retrieve dashboard statistics calculated from MongoDB
 */
export async function getContactStats(): Promise<ContactStats> {
  const response = await fetch(`${CONTACTS_URL}/stats`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch contact statistics');
  }

  const result = await response.json();
  return {
    totalContacts: result.data?.totalContacts ?? 0,
    activeContacts: result.data?.activeContacts ?? 0,
    recentlyAdded: result.data?.recentlyAdded ?? 0
  };
}

/**
 * POST /api/contacts
 * Create a new contact document in MongoDB
 */
export async function createContact(contactData: ContactFormData): Promise<Contact> {
  const response = await fetch(CONTACTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: contactData.name.trim(),
      email: contactData.email.trim().toLowerCase(),
      phone: contactData.phone.trim()
    })
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || 'Failed to create contact');
  }

  return formatContact(result.data);
}

/**
 * PUT /api/contacts/:id
 * Update an existing contact document in MongoDB
 */
export async function updateContact(id: string, contactData: ContactFormData): Promise<Contact> {
  const response = await fetch(`${CONTACTS_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: contactData.name.trim(),
      email: contactData.email.trim().toLowerCase(),
      phone: contactData.phone.trim()
    })
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update contact');
  }

  return formatContact(result.data);
}

/**
 * PATCH /api/contacts/:id/status
 * Update contact active status in MongoDB
 */
export async function updateContactStatus(id: string, isActive: boolean): Promise<Contact> {
  const response = await fetch(`${CONTACTS_URL}/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ isActive })
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update contact status');
  }

  return formatContact(result.data);
}

/**
 * DELETE /api/contacts/:id
 * Remove a contact document from MongoDB
 */
export async function deleteContact(id: string): Promise<{ success: boolean; id: string }> {
  const response = await fetch(`${CONTACTS_URL}/${id}`, {
    method: 'DELETE'
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || 'Failed to delete contact');
  }

  return { success: true, id };
}

/**
 * Reset / reload contacts from MongoDB
 */
export async function resetToDefaultContacts(): Promise<Contact[]> {
  return await getContacts();
}
