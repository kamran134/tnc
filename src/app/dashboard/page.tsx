'use client';

import { useRouter } from 'next/navigation';
import { useCurrentUserQuery, useLogoutMutation, useDashboardStatsQuery } from '@/hooks/queries';
import { StatCard } from '@/components/admin/StatCard';
import { ManagementCard } from '@/components/admin/ManagementCard';

// ─── Stat icons ────────────────────────────────────────────────────────────────

function ServicesIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function NewsIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function CareersIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
    </svg>
  );
}

// ─── Management card icons ──────────────────────────────────────────────────────

function CompanyIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function PageHeroIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function MembershipIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUserQuery();
  const { data: statistics, isLoading: statsLoading } = useDashboardStatsQuery();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push('/dashboard/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <SpinnerIcon />
          <span className="text-xl font-medium text-gray-700">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo & Brand */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">TnC Admin Panel</h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                <GlobeIcon />
                Website
              </a>

              <button
                onClick={() => router.push('/dashboard/settings')}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                <SettingsIcon />
                Settings
              </button>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
              </div>

              <div className="h-6 border-l border-gray-300" />

              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {user.role}
              </span>

              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <LogoutIcon />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName}! 👋
          </h2>
          <p className="text-gray-600">Here&apos;s what&apos;s happening with your business today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Services"
            value={statistics?.totalServices}
            subValue={statistics?.activeServices}
            subLabel="active"
            subColor="text-green-600"
            colorClass="bg-blue-100"
            iconColorClass="text-blue-600"
            isLoading={statsLoading}
            icon={<ServicesIcon />}
          />
          <StatCard
            label="News Articles"
            value={statistics?.totalNews}
            subValue={statistics?.publishedNews}
            subLabel="published"
            subColor="text-green-600"
            colorClass="bg-green-100"
            iconColorClass="text-green-600"
            isLoading={statsLoading}
            icon={<NewsIcon />}
          />
          <StatCard
            label="Contact Inquiries"
            value={statistics?.totalContacts}
            subValue={statistics?.newContacts}
            subLabel="new"
            subColor="text-orange-600"
            colorClass="bg-purple-100"
            iconColorClass="text-purple-600"
            isLoading={statsLoading}
            icon={<ContactIcon />}
          />
          <StatCard
            label="Job Openings"
            value={statistics?.totalCareers}
            subValue={statistics?.activeCareers}
            subLabel="active"
            subColor="text-green-600"
            colorClass="bg-orange-100"
            iconColorClass="text-orange-600"
            isLoading={statsLoading}
            icon={<CareersIcon />}
          />
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ManagementCard
            title="Services Management"
            description="Manage company services, pricing, and descriptions"
            linkLabel="Manage Services"
            colorClass="bg-blue-100"
            iconColorClass="text-blue-600"
            linkColorClass="text-blue-600"
            icon={<ServicesIcon />}
            onClick={() => router.push('/dashboard/services')}
          />
          <ManagementCard
            title="News & Articles"
            description="Create and manage company news, blog posts, and updates"
            linkLabel="Manage News"
            colorClass="bg-green-100"
            iconColorClass="text-green-600"
            linkColorClass="text-green-600"
            icon={<NewsIcon />}
            onClick={() => router.push('/dashboard/news')}
          />
          <ManagementCard
            title="Contact Inquiries"
            description="View and respond to customer contact form submissions"
            linkLabel="View Contacts"
            colorClass="bg-purple-100"
            iconColorClass="text-purple-600"
            linkColorClass="text-purple-600"
            icon={<ContactIcon />}
            onClick={() => router.push('/dashboard/contacts')}
          />
          <ManagementCard
            title="Career Management"
            description="Manage job openings and review applications"
            linkLabel="Manage Careers"
            colorClass="bg-orange-100"
            iconColorClass="text-orange-600"
            linkColorClass="text-orange-600"
            icon={<CareersIcon />}
            onClick={() => router.push('/dashboard/careers')}
          />
          <ManagementCard
            title="Company Information"
            description="Manage company mission, vision, and contact details"
            linkLabel="Manage Company Info"
            colorClass="bg-cyan-100"
            iconColorClass="text-cyan-600"
            linkColorClass="text-cyan-600"
            icon={<CompanyIcon />}
            onClick={() => router.push('/dashboard/company-info')}
          />
          <ManagementCard
            title="Page Hero Sections"
            description="Manage hero sections for all website pages"
            linkLabel="Manage Page Heroes"
            colorClass="bg-pink-100"
            iconColorClass="text-pink-600"
            linkColorClass="text-pink-600"
            icon={<PageHeroIcon />}
            onClick={() => router.push('/dashboard/page-hero')}
          />
          <ManagementCard
            title="Team Management"
            description="Manage team members, positions, and profiles"
            linkLabel="Manage Team"
            colorClass="bg-teal-100"
            iconColorClass="text-teal-600"
            linkColorClass="text-teal-600"
            icon={<TeamIcon />}
            onClick={() => router.push('/dashboard/team')}
          />
          <ManagementCard
            title="Memberships & Partners"
            description="Manage partner organizations and professional memberships"
            linkLabel="Manage Memberships"
            colorClass="bg-sky-100"
            iconColorClass="text-sky-600"
            linkColorClass="text-sky-600"
            icon={<MembershipIcon />}
            onClick={() => router.push('/dashboard/memberships')}
          />
          <ManagementCard
            title="About Sections"
            description="Manage Haqqımızda page content, sections, and images"
            linkLabel="Manage About Sections"
            colorClass="bg-amber-100"
            iconColorClass="text-amber-600"
            linkColorClass="text-amber-600"
            icon={<AboutIcon />}
            onClick={() => router.push('/dashboard/about-sections')}
          />
          <ManagementCard
            title="Analytics & Reports"
            description="View website analytics and generate business reports"
            linkLabel="View Analytics"
            colorClass="bg-indigo-100"
            iconColorClass="text-indigo-600"
            linkColorClass="text-indigo-600"
            icon={<AnalyticsIcon />}
            onClick={() => router.push('/dashboard/analytics')}
          />
          <ManagementCard
            title="System Settings"
            description="Configure system settings and user permissions"
            linkLabel="Open Settings"
            colorClass="bg-gray-100"
            iconColorClass="text-gray-600"
            linkColorClass="text-gray-600"
            icon={<SettingsIcon />}
            onClick={() => router.push('/dashboard/settings')}
          />
        </div>

        {/* Quick Actions — временно скрыто, подключим позже
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Service
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Write Article
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              Post Job Opening
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Report
            </button>
          </div>
        </div>
        */}
      </main>
    </div>
  );
}
