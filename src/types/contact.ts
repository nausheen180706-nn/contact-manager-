/**
 * Contact Types & Interfaces
 * 
 * Used throughout the Contact Manager application.
 * Designed to match MongoDB document structures for seamless backend integration.
 */

export interface Contact {
  id: string; // In MongoDB, this will correspond to document._id
  name: string;
  email: string;
  phone: string;
  createdAt: string; // ISO date string
  status?: 'active' | 'inactive';
  avatarBg?: string; // Color token for initials avatar
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface EndpointInfo {
  method: HttpMethod;
  path: string;
  description: string;
  badgeClass: string;
  samplePayload?: string;
  sampleResponse?: string;
}
