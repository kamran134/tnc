'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAnalyticsQuery, useDashboardStatsQuery, useTrafficQuery } from '@/hooks/queries';
import type { MonthlyStatDto, TrafficAnalyticsDto } from '@/types/api';
import { KpiRow } from './_components/KpiRow';
import { TrafficChart } from './_components/TrafficChart';
import { SourcesCard, TopPagesCard } from './_components/PagesAndSources';
import { DevicesTechCard, PopularContentCard } from './_components/ContentAndTech';
import { AudienceCard, HeatmapCard } from './_components/HeatmapAndAudience';
import { ContactStatusCard, FunnelCard, InventoryRow, MonthlyCard } from './_components/Leads';
import { COLORS, Card, Skeleton, fmtNumber, fmtRange } from './_components/shared';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PERIODS = [
  { key: '7d', label: '7D', days: 7 },
  { key: '30d', label: '30D', days: 30 },
  { key: '90d', label: '90D', days: 90 },
  { key: '12m', label: '12M', days: 365 },
] as const;

type PeriodKey = (typeof PERIODS)[number]['key'];

function parsePeriod(value: string | null): (typeof PERIODS)[number] {
  return PERIODS.find((p) => p.key === value) ?? PERIODS[1];
}

function buildLast12Months(): { year: number; month: number; label: string }[] {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    return { year: d.getFullYear(), month: d.getMonth() + 1, label: MONTH_NAMES[d.getMonth()] };
  });
}

function mergeMonthly(slots: { year: number; month: number; label: string }[], data: MonthlyStatDto[] | undefined) {
  return slots.map((slot) => {
    const found = data?.find((d) => d.year === slot.year && d.month === slot.month);
    return { label: slot.label, count: found?.count ?? 0 };
  });
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

function RealtimePill({ data }: { data: TrafficAnalyticsDto | undefined }) {
  const active = data?.realtime.activeVisitors ?? 0;
  const pages = data?.realtime.pages ?? [];
  return (
    <div className="relative group">
      <button
        type="button"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-sm text-gray-700 hover:border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        aria-label={`${active} visitors online now`}
      >
        <span className="relative flex h-2 w-2">
          {active > 0 && <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60 animate-ping" />}
          <span className={`relative inline-flex h-2 w-2 rounded-full ${active > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
        </span>
        <span className="font-medium tabular-nums">{fmtNumber(active)}</span>
        <span className="text-gray-500">online now</span>
      </button>
      <div className="hidden group-hover:block group-focus-within:block absolute left-0 sm:left-auto sm:right-0 top-full pt-2 z-30 w-64">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-xs font-semibold text-gray-900 mb-2">Active pages (last 5 min)</p>
          {pages.length === 0 ? (
            <p className="text-xs text-gray-400">Nobody is browsing right now.</p>
          ) : (
            <ul className="space-y-1.5">
              {pages.map((p) => (
                <li key={p.path} className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-gray-700 truncate" title={p.path}>
                    {p.path}
                  </span>
                  <span className="text-gray-900 font-medium tabular-nums shrink-0">{p.visitors}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function PeriodSwitch({ value, onChange }: { value: PeriodKey; onChange: (key: PeriodKey) => void }) {
  return (
    <div className="inline-flex rounded-lg bg-gray-100 p-0.5" role="group" aria-label="Period">
      {PERIODS.map((p) => (
        <button
          key={p.key}
          type="button"
          onClick={() => onChange(p.key)}
          aria-pressed={value === p.key}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            value === p.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

function GaButton() {
  const ga4Id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!ga4Id) {
    return (
      <div className="text-right">
        <p className="text-xs text-amber-600 font-medium">Google Analytics not connected</p>
        <p className="text-xs text-gray-400 mt-0.5">Add NEXT_PUBLIC_GA_MEASUREMENT_ID to .env</p>
      </div>
    );
  }
  return (
    <a
      href={
        process.env.NEXT_PUBLIC_GA_PROPERTY_ID
          ? `https://analytics.google.com/analytics/web/#/p${process.env.NEXT_PUBLIC_GA_PROPERTY_ID}/reports/intelligenthome`
          : 'https://analytics.google.com/analytics/web/'
      }
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
    >
      Google Analytics
      <ExternalIcon />
    </a>
  );
}

function SectionSkeleton({ height = 'h-72' }: { height?: string }) {
  return (
    <Card>
      <Skeleton className="h-5 w-32 mb-4" />
      <Skeleton className={`${height} w-full`} />
    </Card>
  );
}

function AnalyticsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const period = parsePeriod(searchParams.get('period'));

  const traffic = useTrafficQuery(period.days);
  const { data: stats, isLoading: statsLoading } = useDashboardStatsQuery();
  const { data: analytics, isLoading: analyticsLoading } = useAnalyticsQuery();

  const data = traffic.data;
  const slots = buildLast12Months();
  const contactsData = mergeMonthly(slots, analytics?.contactsByMonth);
  const newsData = mergeMonthly(slots, analytics?.newsByMonth);

  const changePeriod = (key: PeriodKey) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('period', key);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const firstLoad = traffic.isPending;
  const failed = traffic.isError && !data;

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4 sm:space-y-6">
        {/* Title row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Analytics</h2>
            <p className="text-gray-500 text-sm">
              {data ? fmtRange(data.range.from, data.range.to) : <span className="inline-block h-4 w-40 bg-gray-100 rounded animate-pulse align-middle" />}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <RealtimePill data={data} />
            <PeriodSwitch value={period.key} onChange={changePeriod} />
            <GaButton />
          </div>
        </div>

        {failed ? (
          <div className="bg-white rounded-xl border border-red-200 p-6 text-center">
            <p className="text-sm font-semibold text-gray-900">Could not load traffic analytics</p>
            <p className="text-sm text-gray-500 mt-1">Something went wrong while talking to the server.</p>
            <button
              type="button"
              onClick={() => traffic.refetch()}
              className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {data && data.summary.pageviews === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
                Tracking is live — data appears as visitors arrive. Self-hosted, cookieless, no IPs stored.
              </div>
            )}

            <KpiRow data={data} />

            {firstLoad || !data ? (
              <SectionSkeleton />
            ) : (
              <TrafficChart key={data.range.granularity} data={data} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {data ? (
                <>
                  <TopPagesCard data={data} />
                  <SourcesCard data={data} />
                </>
              ) : (
                <>
                  <SectionSkeleton />
                  <SectionSkeleton />
                </>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {data ? (
                <>
                  <PopularContentCard data={data} />
                  <DevicesTechCard data={data} />
                </>
              ) : (
                <>
                  <SectionSkeleton />
                  <SectionSkeleton />
                </>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {data ? (
                <>
                  <HeatmapCard data={data} />
                  <AudienceCard data={data} />
                </>
              ) : (
                <>
                  <SectionSkeleton height="h-56" />
                  <SectionSkeleton height="h-56" />
                </>
              )}
            </div>

            {/* Leads */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {data ? (
                <>
                  <FunnelCard data={data} />
                  <ContactStatusCard data={data} />
                </>
              ) : (
                <>
                  <SectionSkeleton height="h-40" />
                  <SectionSkeleton height="h-40" />
                </>
              )}
              <MonthlyCard
                title="Contact inquiries"
                subtitle="Submissions per month, last 12 months"
                data={contactsData}
                color={COLORS.aqua}
                name="Submissions"
                loading={analyticsLoading}
              />
              <MonthlyCard
                title="Published news"
                subtitle="Articles published per month"
                data={newsData}
                color={COLORS.violet}
                name="Articles"
                loading={analyticsLoading}
              />
            </div>

            <InventoryRow stats={stats} loading={statsLoading} />
          </>
        )}
      </main>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <AnalyticsContent />
    </Suspense>
  );
}
