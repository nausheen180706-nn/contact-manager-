import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Contact } from '../types/contact';

interface DeleteConfirmModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<boolean>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  contact,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !contact) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await onConfirm(contact.id);
    setIsDeleting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden transform transition-all"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-contact-title"
        aria-describedby="delete-contact-desc"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 id="delete-contact-title" className="text-base font-bold text-slate-900">
              Confirm Deletion
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p id="delete-contact-desc" className="text-sm font-semibold text-slate-800">
            Are you sure you want to delete this contact?
          </p>

          {/* Contact summary card */}
          <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1 text-xs">
            <div className="font-bold text-slate-900 text-sm">
              {contact.name}
            </div>
            <div className="text-slate-500">
              {contact.email} · {contact.phone}
            </div>
            <div className="font-mono text-[11px] text-slate-400 pt-1">
              DELETE /api/contacts/{contact.id}
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            In MongoDB, this will execute <code className="text-rose-600 font-mono">Contact.findByIdAndDelete('{contact.id}')</code>.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-60"
          >
            {isDeleting ? (
              <span>Deleting...</span>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Contact</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
