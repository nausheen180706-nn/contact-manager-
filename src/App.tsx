import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { ContactForm } from './components/ContactForm';
import { ContactList } from './components/ContactList';
import { EditContactModal } from './components/EditContactModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast } from './components/Toast';
import { Contact, ContactFormData, ContactStats, ToastNotification } from './types/contact';
import * as contactApi from './services/contactApi';

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);

  // Modals state
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto dismiss after 3.8 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Health check: GET /api/health
  const checkHealth = useCallback(async () => {
    const isHealthy = await contactApi.checkApiHealth();
    setIsBackendConnected(isHealthy);
  }, []);

  // Fetch statistics: GET /api/contacts/stats
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await contactApi.getContactStats();
      setStats(statsData);
    } catch (error) {
      console.warn('Could not fetch stats from API:', error);
    }
  }, []);

  // Fetch all contacts: GET /api/contacts
  const fetchContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await contactApi.getContacts();
      setContacts(data);
      setIsBackendConnected(true);
    } catch (error: any) {
      console.error('Error fetching contacts:', error);
      setIsBackendConnected(false);
      addToast('error', error.message || 'Failed to fetch contacts from server');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  // Initial load and periodic health monitoring
  useEffect(() => {
    fetchContacts();
    fetchStats();
    checkHealth();

    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, [fetchContacts, fetchStats, checkHealth]);

  // Search handler: GET /api/contacts?search=query
  const handleSearch = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      const results = await contactApi.searchContacts(query);
      setContacts(results);
    } catch (error: any) {
      console.error('Error searching contacts:', error);
      addToast('error', error.message || 'Failed to search contacts');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  // Handler for adding a contact (POST /api/contacts)
  const handleAddContact = async (formData: ContactFormData): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      const newContact = await contactApi.createContact(formData);
      setContacts((prev) => [newContact, ...prev]);
      fetchStats();
      addToast('success', `Contact "${newContact.name}" added successfully`);
      return true;
    } catch (error: any) {
      console.error('Error adding contact:', error);
      addToast('error', error.message || 'Failed to create contact');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for updating a contact (PUT /api/contacts/:id)
  const handleUpdateContact = async (id: string, updatedData: ContactFormData): Promise<boolean> => {
    try {
      const updated = await contactApi.updateContact(id, updatedData);
      setContacts((prev) => prev.map((c) => (c.id === id || c._id === id ? updated : c)));
      fetchStats();
      addToast('success', 'Contact updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating contact:', error);
      addToast('error', error.message || 'Failed to update contact');
      return false;
    }
  };

  // Handler for deleting a contact (DELETE /api/contacts/:id)
  const handleDeleteContact = async (id: string): Promise<boolean> => {
    try {
      await contactApi.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id && c._id !== id));
      fetchStats();
      addToast('success', 'Contact deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting contact:', error);
      addToast('error', error.message || 'Failed to delete contact');
      return false;
    }
  };

  // Refresh contacts and statistics from MongoDB
  const handleResetData = async () => {
    try {
      setIsLoading(true);
      const data = await contactApi.getContacts();
      setContacts(data);
      await fetchStats();
      addToast('info', 'Refreshed contacts from MongoDB');
    } catch (error: any) {
      console.error('Error resetting data:', error);
      addToast('error', error.message || 'Failed to reload contacts');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* 1. NAVBAR WITH BACKEND HEALTH STATUS */}
      <Navbar isBackendConnected={isBackendConnected} />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
        
        {/* 2. DASHBOARD HEADER & STATS */}
        <section>
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manage Your Contacts
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-slate-600">
              Create, view, update and delete contacts using REST APIs.
            </p>
          </div>

          {/* 3 STATS CARDS (CALCULATED FROM MONGODB) */}
          <StatsCards contacts={contacts} stats={stats} />
        </section>

        {/* 3 & 4. CORE APPLICATION WORKSPACE: ADD FORM + DIRECTORY LIST */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Add Contact Form (4 cols on lg screens) */}
          <div className="lg:col-span-4 sticky top-24">
            <ContactForm
              onAddContact={handleAddContact}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Right Column: Contact List Table & Search (8 cols on lg screens) */}
          <div className="lg:col-span-8">
            <ContactList
              contacts={contacts}
              isLoading={isLoading}
              onEdit={(contact) => setEditingContact(contact)}
              onDelete={(contact) => setDeletingContact(contact)}
              onResetData={handleResetData}
              onSearch={handleSearch}
            />
          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-12 bg-white border-t border-slate-200/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Contact Manager</span>
            <span>·</span>
            <span>Full Stack CRUD Application</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Stack:</span>
            <span className="text-slate-700 font-medium">React · TypeScript · Express · MongoDB</span>
          </div>
        </div>
      </footer>

      {/* 6. EDIT CONTACT MODAL */}
      <EditContactModal
        contact={editingContact}
        isOpen={Boolean(editingContact)}
        onClose={() => setEditingContact(null)}
        onSave={handleUpdateContact}
      />

      {/* 7. DELETE CONFIRMATION MODAL */}
      <DeleteConfirmModal
        contact={deletingContact}
        isOpen={Boolean(deletingContact)}
        onClose={() => setDeletingContact(null)}
        onConfirm={handleDeleteContact}
      />

      {/* 9. TOAST NOTIFICATIONS */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}
