'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { PageHero, Alert, Button, Card } from '@/components/ui'
import { contactService } from '@/lib/api'
import { ContactDto } from '@/types/api'
import { useTranslations } from '@/hooks/useTranslations'

export default function ContactPage() {
  const { t } = useTranslations();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setSubmitError(null)
      
      const contactData: Omit<ContactDto, 'id' | 'status' | 'submittedAt' | 'notes' | 'deleted' | 'deletedAt' | 'deletedBy'> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        subject: formData.service || 'General Inquiry',
        message: formData.message
      }
      
      await contactService.submit(contactData)
      
      setSubmitSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: ''
      })
      
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    } catch (err) {
      console.error('Failed to submit contact form:', err)
      setSubmitError(t('contact.errorMessage'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section - Refactored to use PageHero component */}
        <PageHero 
          pageTag="CONTACT"
          fallbackTitle={t('contact.title')}
          fallbackDescription={t('contact.getInTouch')}
        />

        {/* Contact Form & Info */}
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t('contact.sendMessage')}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('contact.fullName')} *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 text-gray-900"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('contact.email')} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 text-gray-900"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('contact.phone')}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 text-gray-900"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('contact.company')}
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 text-gray-900"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.serviceOfInterest')}
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 text-gray-900"
                    >
                      <option value="">{t('contact.selectService')}</option>
                      <option value="accounting">{t('footer.services.accounting')}</option>
                      <option value="tax-compliance">{t('footer.services.taxCompliance')}</option>
                      <option value="tax-advisory">{t('footer.services.taxAdvisory')}</option>
                      <option value="legal">{t('footer.services.legal')}</option>
                      <option value="hr">{t('footer.services.hr')}</option>
                      <option value="other">{t('contact.other')}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.message')} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 text-gray-900"
                      placeholder={t('contact.messagePlaceholder')}
                    ></textarea>
                  </div>
                  
                  {submitSuccess && (
                    <Alert type="success" message={t('contact.successMessage')} />
                  )}
                  
                  {submitError && (
                    <Alert type="error" message={submitError} />
                  )}
                  
                  <Button
                    type="submit"
                    disabled={submitting}
                    fullWidth
                  >
                    {submitting ? t('contact.sending') : t('contact.send')}
                  </Button>
                </form>
              </Card>

              {/* Contact Information */}
              <div className="space-y-8">
                <Card>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {t('contact.contactInformation')}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-primary-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <h3 className="font-semibold text-gray-900">{t('contact.address')}</h3>
                        <p className="text-gray-600">
                          {t('contact.officeAddress')}<br />
                          {t('footer.location')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-primary-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <h3 className="font-semibold text-gray-900">{t('footer.phone')}</h3>
                        <p className="text-gray-600">+994 XX XXX XX XX</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-primary-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <h3 className="font-semibold text-gray-900">{t('footer.email')}</h3>
                        <p className="text-gray-600">info@tnc.az</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-primary-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 className="font-semibold text-gray-900">{t('contact.businessHours')}</h3>
                        <p className="text-gray-600">
                          {t('contact.mondayFriday')}: 9:00 AM - 6:00 PM<br />
                          {t('contact.saturday')}: 10:00 AM - 2:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <div className="bg-primary-50 p-8 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {t('contact.scheduleConsultation')}
                  </h3>
                  <p className="text-gray-700 mb-6">
                    {t('contact.consultationDescription')}
                  </p>
                  <Button>
                    {t('contact.bookConsultation')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
