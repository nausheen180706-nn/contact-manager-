import React, { useState, useMemo } from 'react';
import { Search, Edit2, Trash2, Mail, Phone, Calendar, Users, RefreshCw } from 'lucide-react';
import { Contact } from '../types/contact';
import { ContactCard } from './ContactCard';
import { getInitials } from '../data/mockContacts';

interface ContactListProps {
  contacts: Contact[];
  isLoading: boolean;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onResetData: () => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  isLoading,
  onEdit,
  onDelete,
  onResetData
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter contacts by Name, Email, Phone
  const filteredContacts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return contacts;

    return contacts.filter((c) => {
      const matchName = c.name.toLowerCase().includes(query);
      const matchEmail = c.email.toLowerCase().includes(query);
      const matchPhone = c.phone.toLowerCase().includes(query);
      return matchName || matchEmail || matchPhone;
    });
  }, [contacts, searchQuery]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      
      {/* Header with Title & Search Bar */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Contact Directory
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 tabular-nums">
              {filteredContacts.length} {filteredContacts.length === 1 ? 'contact' : 'contacts'}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Rendered from <code className="text-blue-600 font-mono">GET /api/contacts</code> response state
          </p>
        </div>

        {/* Search & Reset tools */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={onResetData}
            title="Reset to default mock contacts"
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors shrink-0"
            aria-label="Reset demo sample data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        // Loading state
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-3 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-slate-600">Simulating GET /api/contacts...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        // Empty State (Section 8)
        <div className="p-12 text-center max-w-sm mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            No contacts found
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            {searchQuery
              ? `No contacts match "${searchQuery}". Try searching another name, email, or phone.`
              : 'Add your first contact to get started.'}
          </p>
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Clear search filter
            </button>
          ) : (
            <button
              onClick={onResetData}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Sample Contacts</span>
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View (hidden on mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th scope="col" className="py-3.5 pl-6 pr-4">Contact</th>
                  <th scope="col" className="py-3.5 px-4">Email</th>
                  <th scope="col" className="py-3.5 px-4">Phone</th>
                  <th scope="col" className="py-3.5 px-4">Created Date</th>
                  <th scope="col" className="py-3.5 pr-6 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredContacts.map((contact) => {
                  const initials = getInitials(contact.name);
                  const formattedDate = new Date(contact.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <tr
                      key={contact.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Contact: Avatar + Name */}
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${
                              contact.avatarBg || 'bg-blue-600'
                            } text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                              {contact.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 truncate">
                              ID: {contact.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-4 text-slate-600">
                        <div className="flex items-center gap-2 max-w-[220px]">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate" title={contact.email}>
                            {contact.email}
                          </span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-2 font-mono text-xs text-slate-700">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{contact.phone}</span>
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-4 text-slate-500 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className="tabular-nums">{formattedDate}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pr-6 pl-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => onEdit(contact)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                            title="Edit contact details (PUT /api/contacts/:id)"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => onDelete(contact)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                            title="Delete contact (DELETE /api/contacts/:id)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Grid (hidden on desktop) */}
          <div className="md:hidden p-4 space-y-3 bg-slate-50/50">
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </>
      )}

      {/* Footer count indicator */}
      <div className="px-6 py-3 bg-slate-50/70 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
        <span>
          Showing <strong className="text-slate-800 tabular-nums">{filteredContacts.length}</strong> of{' '}
          <strong className="text-slate-800 tabular-nums">{contacts.length}</strong> contacts
        </span>
        <span className="text-[11px] text-slate-400">
          Client state synchronized with mock REST endpoints
        </span>
      </div>

    </div>
  );
};
