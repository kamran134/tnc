'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { contactService } from '@/lib/api';
import { useServicesListQuery } from '@/hooks/queries';
import { useTranslations } from '@/hooks/useTranslations';
import type { ContactDto, LanguageCode } from '@/types/api';

const EMPTY_FORM = { name: '', email: '', phone: '', company: '', service: '', message: '' };

function ContactFormInner() {
  const { t, locale } = useTranslations();
  const searchParams = useSearchParams();
  const { data: services = [] } = useServicesListQuery(locale as LanguageCode);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Preselect the service passed as ?service=
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      setFormData((prev) => ({ ...prev, service: decodeURIComponent(serviceParam) }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setSubmitError(null);

      const contactData: Omit<ContactDto, 'id' | 'status' | 'submittedAt' | 'notes' | 'deleted' | 'deletedAt' | 'deletedBy'> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        subject: formData.service || 'General Inquiry',
        message: formData.message,
      };

      await contactService.submit(contactData);

      setSubmitSuccess(true);
      setFormData(EMPTY_FORM);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to submit contact form:', err);
      setSubmitError(t('contact.errorMessage'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="box-border grid min-w-0 flex-[999_1_520px] grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-[18px] rounded-xl border border-navy-line bg-navy-800 p-6 sm:p-9"
    >
      <h2 className="col-span-full m-0 text-[26px] font-semibold tracking-[-0.015em]">{t('contact.sendMessage')}</h2>

      <label className="site-field">
        {t('contact.fullName')} *
        <input type="text" name="name" required autoComplete="name" value={formData.name} onChange={handleChange} />
      </label>
      <label className="site-field">
        {t('contact.company')}
        <input type="text" name="company" autoComplete="organization" value={formData.company} onChange={handleChange} />
      </label>
      <label className="site-field">
        {t('contact.email')} *
        <input type="email" name="email" required autoComplete="email" value={formData.email} onChange={handleChange} />
      </label>
      <label className="site-field">
        {t('contact.phone')}
        <input type="tel" name="phone" autoComplete="tel" value={formData.phone} onChange={handleChange} />
      </label>
      <label className="site-field col-span-full">
        {t('contact.serviceOfInterest')}
        <select name="service" value={formData.service} onChange={handleChange}>
          <option value="">{t('contact.selectService')}</option>
          {services.map((service) => (
            <option key={service.id} value={service.title}>
              {service.title}
            </option>
          ))}
          <option value="other">{t('contact.other')}</option>
        </select>
      </label>
      <label className="site-field col-span-full">
        {t('contact.message')} *
        <textarea
          name="message"
          rows={5}
          required
          value={formData.message}
          onChange={handleChange}
          placeholder={t('contact.messagePlaceholder')}
        />
      </label>

      {submitSuccess && (
        <p role="status" className="col-span-full m-0 rounded-md border border-navy-accent/40 bg-navy-700 px-4 py-3 text-navy-text">
          {t('contact.successMessage')}
        </p>
      )}
      {submitError && (
        <p role="alert" className="col-span-full m-0 rounded-md border border-red-400/50 bg-red-950/40 px-4 py-3 text-red-200">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="col-span-full min-h-[56px] cursor-pointer rounded-md border-0 bg-navy-accent text-base font-semibold text-navy-950 transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? t('contact.sending') : t('contact.send')}
      </button>
    </form>
  );
}

/** Contact form card (dark theme). Same service + payload as the original contact page. */
export default function SiteContactForm() {
  return (
    <Suspense fallback={null}>
      <ContactFormInner />
    </Suspense>
  );
}
