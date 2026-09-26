import React from 'react';
import { Mail, Phone, Calendar, Edit2, Trash2 } from 'lucide-react';
import { Contact } from '../types/contact';
import { getInitials } from '../data/mockContacts';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact, onEdit, onDelete }) => {
  const formattedDate = new Date(contact.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const initials = getInitials(contact.name);
  const avatarClass = contact.avatarBg || 'bg-blue-600';

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-3">
      {/* Top Header: Avatar + Name + Actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-11 h-11 rounded-full ${avatarClass} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs`}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {contact.name}
            </h3>
            <span className="text-[11px] font-mono text-slate-400 truncate block">
              ID: {contact.id}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(contact)}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit contact"
            aria-label={`Edit ${contact.name}`}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(contact)}
            className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete contact"
            aria-label={`Delete ${contact.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <a
            href={`mailto:${contact.email}`}
            className="hover:text-blue-600 hover:underline truncate"
          >
            {contact.email}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <a
            href={`tel:${contact.phone}`}
            className="hover:text-blue-600 hover:underline font-mono text-[11px]"
          >
            {contact.phone}
          </a>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Added {formattedDate}</span>
        </div>
      </div>
    </div>
  );
};
