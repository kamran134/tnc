'use client';

import { useRouter } from 'next/navigation';
import { useAnalyticsQuery, useDashboardStatsQuery } from '@/hooks/queries';
import type { MonthlyStatDto } from '@/types/api';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function buildLast12Months(): { year: number; month: number; label: string }[] {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    return { year: d.getFullYear(), month: d.getMonth() + 1, label: MONTH_NAMES[d.getMonth()] };
  });
}

function mergeMonthly(slots: { year: number; month: number; label: string }[], data: MonthlyStatDto[]) {
  return slots.map(slot => {
    const found = data.find(d => d.year === slot.year && d.month === slot.month);
    return { ...slot, count: found?.count ?? 0 };
  });
}

interface BarChartProps {
  data: { label: string; count: number }[];
  color: string;
  label: string;
}

function BarChart({ data, color, label }: BarChartProps) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div>
      <p className="text-sm font-medium text-gray-500 mb-3">{label}</p>
      <div className="flex items-end gap-1.5 h-36">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-gray-400">{d.count > 0 ? d.count : ''}</span>
            <div
              className={`w-full rounded-t transition-all ${color}`}
              style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count > 0 ? '4px' : '2px', opacity: d.count > 0 ? 1 : 0.2 }}
            />
            <span className="text-[10px] text-gray-400">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BackIcon() {
  return (
    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { data: stats, isLoading: statsLoading } = useDashboardStatsQuery();
  const { data: analytics, isLoading: analyticsLoading } = useAnalyticsQuery();

  const slots = buildLast12Months();
  const contactsData = analytics ? mergeMonthly(slots, analytics.contactsByMonth) : slots.map(s => ({ ...s, count: 0 }));
  const newsData = analytics ? mergeMonthly(slots, analytics.newsByMonth) : slots.map(s => ({ ...s, count: 0 }));

  const ga4Id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">TnC Admin Panel</h1>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              <BackIcon />
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Analytics & Reports</h2>
            <p className="text-gray-500 text-sm">Last 12 months — data from your database</p>
          </div>
          {ga4Id ? (
            <a
              href={`https://analytics.google.com/analytics/web/#/p${ga4Id}/reports/intelligenthome`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Open Google Analytics
              <ExternalIcon />
            </a>
          ) : (
            <div className="text-right">
              <p className="text-xs text-amber-600 font-medium">Google Analytics not connected</p>
              <p className="text-xs text-gray-400 mt-0.5">Add NEXT_PUBLIC_GA_MEASUREMENT_ID to .env</p>
            </div>
          )}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Contacts', value: stats?.totalContacts, sub: `${stats?.newContacts ?? 0} new`, subColor: 'text-orange-600' },
            { label: 'Total News', value: stats?.totalNews, sub: `${stats?.publishedNews ?? 0} published`, subColor: 'text-green-600' },
            { label: 'Total Services', value: stats?.totalServices, sub: `${stats?.activeServices ?? 0} active`, subColor: 'text-blue-600' },
            { label: 'Job Openings', value: stats?.totalCareers, sub: `${stats?.activeCareers ?? 0} active`, subColor: 'text-purple-600' },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">{card.label}</p>
              {statsLoading ? (
                <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
              ) : (
                <>
                  <p className="text-3xl font-bold text-gray-900">{card.value ?? '—'}</p>
                  <p className={`text-xs mt-1 font-medium ${card.subColor}`}>{card.sub}</p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Charts */}
        {analyticsLoading ? (
          <div className="flex justify-center py-20">
            <SpinnerIcon />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Contact Inquiries</h3>
              <BarChart data={contactsData} color="bg-indigo-500" label="Submissions per month" />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Published News</h3>
              <BarChart data={newsData} color="bg-green-500" label="Articles published per month" />
            </div>
          </div>
        )}

        {/* GA4 hint if not connected */}
        {!ga4Id && (
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-amber-800 mb-1">Connect Google Analytics 4</h4>
            <p className="text-sm text-amber-700">
              Add <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX</code> to your{' '}
              <code className="bg-amber-100 px-1 rounded">.env.local</code> file and redeploy.
              GA4 will track page views, sessions, traffic sources, and user geography automatically.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
