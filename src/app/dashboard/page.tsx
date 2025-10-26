'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { adminDashboardService, DashboardDataDto } from '@/lib/api'
import { LoadingSpinner, Alert } from '@/components/ui'

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout, isLoading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<DashboardDataDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/dashboard/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true)
      const data = await adminDashboardService.getStatistics()
      setStats(data)
      setError(null)
    } catch (err) {
      setError('Failed to load dashboard statistics')
      console.error('Dashboard error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/dashboard/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'content', name: 'Content Management', icon: '📝' },
    { id: 'services', name: 'Services', icon: '⚙️' },
    { id: 'news', name: 'News Articles', icon: '📰' },
    { id: 'jobs', name: 'Job Openings', icon: '💼' },
    { id: 'contacts', name: 'Contact Inquiries', icon: '📧' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-primary-700">
                TnC Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.firstName} {user.lastName}
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Logout
              </button>
              <Link href="/" className="text-primary-600 hover:text-primary-700">
                ← Website
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-6">
            <ul className="space-y-2">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'overview' && (
            <OverviewTab stats={stats} isLoading={isLoading} error={error} />
          )}
          {activeTab === 'content' && <ContentManagementTab />}
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'news' && <NewsTab />}
          {activeTab === 'jobs' && <JobsTab />}
          {activeTab === 'contacts' && <ContactsTab />}
        </main>
      </div>
    </div>
  )
}

function OverviewTab({ 
  stats, 
  isLoading, 
  error 
}: { 
  stats: DashboardDataDto | null
  isLoading: boolean
  error: string | null
}) {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert type="error" message={error || 'Failed to load statistics'} />
      </div>
    )
  }

  const statCards = [
    { 
      label: 'Total Services', 
      value: stats.totalServices.toString(), 
      active: stats.activeServices.toString(),
      change: `${stats.activeServices} active`
    },
    { 
      label: 'News Articles', 
      value: stats.totalNews.toString(), 
      active: stats.publishedNews.toString(),
      change: `${stats.publishedNews} published` 
    },
    { 
      label: 'Job Openings', 
      value: stats.totalCareers.toString(), 
      active: stats.activeCareers.toString(),
      change: `${stats.activeCareers} active positions` 
    },
    { 
      label: 'Contact Inquiries', 
      value: stats.totalContacts.toString(), 
      active: stats.newContacts.toString(),
      change: `${stats.newContacts} new` 
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {stat.label}
            </h3>
            <div className="mt-2">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">📝</div>
              <p className="font-medium">Add News Article</p>
            </div>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">💼</div>
              <p className="font-medium">Post New Job</p>
            </div>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">⚙️</div>
              <p className="font-medium">Update Services</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

function ContentManagementTab() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Content Management</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input type="text" className="w-full p-2 border rounded-md" defaultValue="TnC Tax & Consulting" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" className="w-full p-2 border rounded-md" defaultValue="info@tnc.az" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mission Statement</h2>
          <textarea 
            className="w-full p-3 border rounded-md h-24" 
            defaultValue="We are dedicated to delivering high-caliber services, grounded in a thorough understanding of our clients' specific industries and operational needs..."
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Vision Statement</h2>
          <textarea 
            className="w-full p-3 border rounded-md h-24" 
            defaultValue="Our aspiration is to consistently deliver exceptional outcomes that go beyond client expectations..."
          />
        </div>
      </div>
    </div>
  )
}

function ServicesTab() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Services Management</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Services management interface will be implemented here.</p>
      </div>
    </div>
  )
}

function NewsTab() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">News Articles</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">News management interface will be implemented here.</p>
      </div>
    </div>
  )
}

function JobsTab() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Openings</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Job management interface will be implemented here.</p>
      </div>
    </div>
  )
}

function ContactsTab() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Inquiries</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Contact inquiries management interface will be implemented here.</p>
      </div>
    </div>
  )
}
