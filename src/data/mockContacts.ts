import { Contact } from '../types/contact';

/**
 * Initial mock contact data.
 * Used for demonstrating CRUD operations on the frontend before connecting to MongoDB.
 */
export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c_65d0a1e8471b01',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@techcorp.io',
    phone: '+1 (555) 234-8901',
    createdAt: '2026-03-15T09:30:00Z',
    status: 'active',
    avatarBg: 'bg-blue-500'
  },
  {
    id: 'c_65d0a1e8471b02',
    name: 'Alexander Chen',
    email: 'alex.chen@innovate.dev',
    phone: '+1 (555) 872-3310',
    createdAt: '2026-03-18T14:15:00Z',
    status: 'active',
    avatarBg: 'bg-emerald-500'
  },
  {
    id: 'c_65d0a1e8471b03',
    name: 'Elena Rostova',
    email: 'elena.rostova@designworks.com',
    phone: '+1 (555) 431-7729',
    createdAt: '2026-03-20T11:45:00Z',
    status: 'active',
    avatarBg: 'bg-purple-500'
  },
  {
    id: 'c_65d0a1e8471b04',
    name: 'Marcus Williams',
    email: 'marcus.williams@cloudnative.co',
    phone: '+1 (555) 908-1124',
    createdAt: '2026-03-22T16:20:00Z',
    status: 'active',
    avatarBg: 'bg-amber-500'
  },
  {
    id: 'c_65d0a1e8471b05',
    name: 'Priya Sharma',
    email: 'priya.sharma@globalfintech.org',
    phone: '+1 (555) 674-9082',
    createdAt: '2026-03-24T08:10:00Z',
    status: 'active',
    avatarBg: 'bg-rose-500'
  },
  {
    id: 'c_65d0a1e8471b06',
    name: 'David Kim',
    email: 'david.kim@datasolutions.net',
    phone: '+1 (555) 349-5561',
    createdAt: '2026-03-25T13:00:00Z',
    status: 'active',
    avatarBg: 'bg-indigo-500'
  }
];

export const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-purple-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-cyan-500'
];

/**
 * Helper to generate initials from a name (e.g., "Sarah Jenkins" -> "SJ")
 */
export function getInitials(name: string): string {
  if (!name.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
