import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { ContactForm } from './components/ContactForm';
import { ContactList } from './components/ContactList';
import { EditContactModal } from './components/EditContactModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast } from './components/Toast';
import { Contact, ContactFormData, ToastNotification } from './types/contact';
import * as contactApi from './services/contactApi';

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  // Initial data fetch simulating GET /api/contacts
  const fetchContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await contactApi.getContacts();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      addToast('error', 'Failed to fetch contacts from API');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Handler for adding a contact (POST /api/contacts)
  const handleAddContact = async (formData: ContactFormData): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      const newContact = await contactApi.createContact(formData);
      setContacts((prev) => [newContact, ...prev]);
      addToast('success', `Contact "${newContact.name}" added successfully`);
      return true;
    } catch (error) {
      console.error('Error adding contact:', error);
      addToast('error', 'Failed to create contact');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for updating a contact (PUT /api/contacts/:id)
  const handleUpdateContact = async (id: string, updatedData: ContactFormData): Promise<boolean> => {
    try {
      const updated = await contactApi.updateContact(id, updatedData);
      setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
      addToast('success', `Contact "${updated.name}" updated successfully`);
      return true;
    } catch (error) {
      console.error('Error updating contact:', error);
      addToast('error', 'Failed to update contact');
      return false;
    }
  };

  // Handler for deleting a contact (DELETE /api/contacts/:id)
  const handleDeleteContact = async (id: string): Promise<boolean> => {
    try {
      const targetName = contacts.find((c) => c.id === id)?.name || 'Contact';
      await contactApi.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      addToast('success', `${targetName} deleted successfully`);
      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      addToast('error', 'Failed to delete contact');
      return false;
    }
  };

  // Reset to default sample contacts
  const handleResetData = async () => {
    try {
      setIsLoading(true);
      const defaultData = await contactApi.resetToDefaultContacts();
      setContacts(defaultData);
      addToast('info', 'Loaded default mock contacts');
    } catch (error) {
      console.error('Error resetting data:', error);
      addToast('error', 'Failed to reload mock contacts');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* 1. NAVBAR */}
      <Navbar />

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

          {/* 3 STATS CARDS */}
          <StatsCards contacts={contacts} />
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
            <span>CRUD Application UI</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Stack:</span>
            <span className="text-slate-700 font-medium">React · TypeScript · Tailwind CSS</span>
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
