'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DashboardDataDto, TrafficAnalyticsDto } from '@/types/api';
import { COLORS, Card, EmptyNote, Skeleton, fmtNumber, fmtPercent } from './shared';

export interface MonthlySlot {
  label: string;
  count: number;
}

const STATUS_LABEL: Record<string, string> = {
  NEW: 'New',
  READ: 'Read',
  REPLIED: 'Replied',
  CLOSED: 'Closed',
};

const FUNNEL_SHADES = ['#86b6ef', '#3987e5', '#184f95'];

export function FunnelCard({ data }: { data: TrafficAnalyticsDto }) {
  const contactPageVisitors = data.topPages
    .filter((p) => p.pageType === 'CONTACT')
    .reduce((acc, p) => acc + p.visitors, 0);
  const visitors = data.summary.visitors;
  const steps: { label: string; value: number }[] = [{ label: 'Visitors', value: visitors }];
  if (contactPageVisitors > 0) {
    steps.push({ label: 'Contact page visitors', value: Math.min(contactPageVisitors, visitors) });
  }
  steps.push({ label: 'Contact submissions', value: data.summary.contacts });

  const colorFor = (i: number) => FUNNEL_SHADES[i === steps.length - 1 ? FUNNEL_SHADES.length - 1 : i];

  return (
    <Card title="Lead funnel" subtitle="From visit to contact request">
      <ul className="space-y-4">
        {steps.map((s, i) => {
          const pct = visitors > 0 ? Math.max(s.value > 0 ? 2 : 0, Math.min(100, (s.value / visitors) * 100)) : 0;
          const prev = i > 0 ? steps[i - 1].value : 0;
          return (
            <li key={s.label}>
              <div className="flex items-baseline justify-between gap-3 text-sm mb-1.5">
                <span className="text-gray-700">{s.label}</span>
                <span className="text-gray-900 font-medium tabular-nums">
                  {fmtNumber(s.value)}
                  {i > 0 && prev > 0 && (
                    <span className="text-gray-400 text-xs font-normal ml-1.5">{fmtPercent(s.value / prev, 1)}</span>
                  )}
                </span>
              </div>
              <div className="h-5 w-full bg-gray-100 rounded">
                <div className="h-full rounded" style={{ width: `${pct}%`, backgroundColor: colorFor(i) }} />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-gray-400 mt-4">
        Overall conversion: {fmtPercent(data.summary.conversionRate, 2)} of visitors submitted a contact form.
      </p>
    </Card>
  );
}

export function ContactStatusCard({ data }: { data: TrafficAnalyticsDto }) {
  const rows = data.contactsByStatus;
  const total = rows.reduce((acc, r) => acc + r.count, 0);
  const max = Math.max(...rows.map((r) => r.count), 0);
  return (
    <Card title="Contacts by status" subtitle="Submitted in the selected period">
      {rows.length === 0 ? (
        <EmptyNote />
      ) : (
        <>
          <p className="text-3xl font-bold text-gray-900 tabular-nums mb-4">
            {fmtNumber(total)} <span className="text-sm font-medium text-gray-400">total</span>
          </p>
          <ul className="space-y-3">
            {rows.map((r) => (
              <li key={r.status}>
                <div className="flex items-baseline justify-between text-sm mb-1">
                  <span className="text-gray-700">{STATUS_LABEL[r.status] ?? r.status}</span>
                  <span className="text-gray-900 font-medium tabular-nums">{fmtNumber(r.count)}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${r.count > 0 && max > 0 ? Math.max(2, (r.count / max) * 100) : 0}%`, backgroundColor: COLORS.orange }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

function MonthlyBars({ data, color, name }: { data: MonthlySlot[]; color: string; name: string }) {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={COLORS.grid} vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: COLORS.axis }} tickLine={false} axisLine={{ stroke: COLORS.grid }} interval="preserveStartEnd" minTickGap={4} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: COLORS.axis }} tickLine={false} axisLine={false} width={28} />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
            formatter={(value) => [fmtNumber(Number(value)), name]}
            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
          />
          <Bar dataKey="count" fill={color} radius={[4, 4, 0, 0]} maxBarSize={22} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthlyCard({
  title,
  subtitle,
  data,
  color,
  name,
  loading,
}: {
  title: string;
  subtitle: string;
  data: MonthlySlot[];
  color: string;
  name: string;
  loading: boolean;
}) {
  return (
    <Card title={title} subtitle={subtitle}>
      {loading ? <Skeleton className="h-48 w-full" /> : <MonthlyBars data={data} color={color} name={name} />}
    </Card>
  );
}

export function InventoryRow({ stats, loading }: { stats: DashboardDataDto | undefined; loading: boolean }) {
  const items = [
    { label: 'Services', total: stats?.totalServices, sub: `${stats?.activeServices ?? 0} active` },
    { label: 'News', total: stats?.totalNews, sub: `${stats?.publishedNews ?? 0} published` },
    { label: 'Job openings', total: stats?.totalCareers, sub: `${stats?.activeCareers ?? 0} active` },
    { label: 'Contacts', total: stats?.totalContacts, sub: `${stats?.newContacts ?? 0} new` },
  ];
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Content inventory</h3>
      <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.label} className="min-w-0">
            <dt className="text-xs text-gray-500 uppercase tracking-wide font-medium">{it.label}</dt>
            {loading ? (
              <Skeleton className="h-6 w-12 mt-1" />
            ) : (
              <dd className="mt-0.5 flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900 tabular-nums">{it.total ?? '—'}</span>
                <span className="text-xs text-gray-400 truncate">{it.sub}</span>
              </dd>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}
