import React, { useState } from 'react';
import { UserPlus, RotateCcw, User, Mail, Phone, ArrowUpRight } from 'lucide-react';
import { ContactFormData, FormErrors } from '../types/contact';

interface ContactFormProps {
  onAddContact: (formData: ContactFormData) => Promise<boolean>;
  isSubmitting?: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onAddContact, isSubmitting = false }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate Name
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate Phone
    const phoneTrimmed = formData.phone.trim();
    if (!phoneTrimmed) {
      newErrors.phone = 'Phone number is required';
    } else if (phoneTrimmed.length < 7) {
      newErrors.phone = 'Please enter a valid phone number (min 7 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field as user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleClear = () => {
    setFormData({ name: '', email: '', phone: '' });
    setErrors({});
    setTouched({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true });

    if (!validate()) {
      return;
    }

    const success = await onAddContact(formData);
    if (success) {
      handleClear();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </span>
            Add New Contact
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Fills the payload sent in HTTP <span className="font-mono font-semibold text-blue-600">POST /api/contacts</span>
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              placeholder="e.g. Maya Lin"
              disabled={isSubmitting}
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white rounded-xl border transition-colors outline-none focus:ring-3 ${
                errors.name && touched.name
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10'
                  : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/10'
              }`}
            />
          </div>
          {errors.name && touched.name && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              placeholder="e.g. maya.lin@example.com"
              disabled={isSubmitting}
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white rounded-xl border transition-colors outline-none focus:ring-3 ${
                errors.email && touched.email
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10'
                  : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/10'
              }`}
            />
          </div>
          {errors.email && touched.email && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              onBlur={() => handleBlur('phone')}
              placeholder="e.g. +1 (555) 492-8819"
              disabled={isSubmitting}
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white rounded-xl border transition-colors outline-none focus:ring-3 ${
                errors.phone && touched.phone
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10'
                  : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/10'
              }`}
            />
          </div>
          {errors.phone && touched.phone && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Adding Contact...
              </span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Add Contact</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={isSubmitting || (!formData.name && !formData.email && !formData.phone)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-sm font-medium rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Clear</span>
          </button>
        </div>

        {/* Beginner Webinar Context Tip */}
        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
          <ArrowUpRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>Submitting triggers <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700 font-mono">createContact()</code> in the API service.</span>
        </div>

      </form>
    </div>
  );
};
