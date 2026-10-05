'use client';

import type { ReactNode } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { TrafficPageType, TrafficSourceType, TrafficTopPageDto } from '@/types/api';

// ---------- Palette (categorical slots in fixed order, light surface) ----------
export const COLORS = {
  blue: '#2a78d6',
  orange: '#eb6834',
  aqua: '#1baf7a',
  yellow: '#eda100',
  magenta: '#e87ba4',
  green: '#008300',
  violet: '#4a3aa7',
  red: '#e34948',
  other: '#9ca3af',
  grid: '#eceae6',
  axis: '#6b7280',
} as const;

export const CATEGORICAL = [
  COLORS.blue,
  COLORS.orange,
  COLORS.aqua,
  COLORS.yellow,
  COLORS.magenta,
  COLORS.green,
  COLORS.violet,
  COLORS.red,
];

/** Color follows the entity, never its rank. */
export const SOURCE_TYPE_COLOR: Record<TrafficSourceType, string> = {
  DIRECT: COLORS.blue,
  SEARCH: COLORS.orange,
  SOCIAL: COLORS.aqua,
  REFERRAL: COLORS.yellow,
  CAMPAIGN: COLORS.magenta,
};

export const SOURCE_TYPE_LABEL: Record<TrafficSourceType, string> = {
  DIRECT: 'Direct',
  SEARCH: 'Search',
  SOCIAL: 'Social',
  REFERRAL: 'Referral',
  CAMPAIGN: 'Campaign',
};

export const DEVICE_COLOR: Record<string, string> = {
  DESKTOP: COLORS.blue,
  MOBILE: COLORS.orange,
  TABLET: COLORS.aqua,
};

export const DEVICE_LABEL: Record<string, string> = {
  DESKTOP: 'Desktop',
  MOBILE: 'Mobile',
  TABLET: 'Tablet',
};

// ---------- Formatting ----------
const NUMBER_FMT = new Intl.NumberFormat('en-US');

export function fmtNumber(n: number | null | undefined): string {
  return NUMBER_FMT.format(n ?? 0);
}

/** Compact (1.2k) from 10 000 upwards, plain otherwise. */
export function fmtCompact(n: number | null | undefined): string {
  const v = n ?? 0;
  if (Math.abs(v) < 10_000) return NUMBER_FMT.format(v);
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(v).toLowerCase();
}

export function fmtPercent(ratio: number | null | undefined, digits = 1): string {
  const v = (ratio ?? 0) * 100;
  return `${v.toFixed(digits)}%`;
}

export function fmtDuration(totalSec: number | null | undefined): string {
  const s = Math.max(0, Math.round(totalSec ?? 0));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

/** Parses "YYYY-MM-DD" as a local date (avoids UTC off-by-one shifts). */
export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function fmtShortDate(iso: string, granularity: 'DAY' | 'MONTH'): string {
  const d = parseIsoDate(iso);
  if (granularity === 'MONTH') {
    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function fmtLongDate(iso: string, granularity: 'DAY' | 'MONTH'): string {
  const d = parseIsoDate(iso);
  if (granularity === 'MONTH') {
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export function fmtRange(fromIso: string, toIso: string): string {
  const from = parseIsoDate(fromIso);
  const to = parseIsoDate(toIso);
  const a = from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const b = to.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  if (from.getFullYear() !== to.getFullYear()) {
    return `${from.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} – ${b}`;
  }
  return `${a} – ${b}`;
}

// ---------- Labels ----------
export const PAGE_TYPE_LABEL: Record<TrafficPageType, string> = {
  HOME: 'Home',
  NEWS_LIST: 'News',
  NEWS_DETAIL: 'News article',
  CAREERS_LIST: 'Careers',
  CAREER_DETAIL: 'Vacancy',
  SERVICES: 'Services',
  SERVICE_CATEGORY: 'Service category',
  ABOUT: 'About',
  TEAM: 'Team',
  CONTACT: 'Contact',
  OTHER: 'Other',
};

export function pageLabel(page: Pick<TrafficTopPageDto, 'pageType' | 'title'>): string {
  return page.title?.trim() || PAGE_TYPE_LABEL[page.pageType] || 'Other';
}

const TIMEZONE_LABEL: Record<string, string> = {
  'Asia/Baku': 'Azerbaijan',
  'Europe/Istanbul': 'Türkiye',
  'Europe/Moscow': 'Russia',
  'Asia/Tbilisi': 'Georgia',
  'Europe/London': 'UK',
  'Asia/Dubai': 'UAE',
  'Europe/Berlin': 'Germany',
  'America/New_York': 'USA (East)',
};

export function timezoneLabel(zone: string): string {
  if (TIMEZONE_LABEL[zone]) return TIMEZONE_LABEL[zone];
  const city = zone.split('/').pop() ?? zone;
  return city.replace(/_/g, ' ');
}

export const SITE_LANGUAGE_LABEL: Record<string, string> = {
  az: 'Azərbaycan',
  en: 'English',
  ru: 'Русский',
};

export const BROWSER_LANGUAGE_LABEL: Record<string, string> = {
  az: 'Azerbaijani',
  en: 'English',
  ru: 'Russian',
  tr: 'Turkish',
  de: 'German',
  fr: 'French',
  uk: 'Ukrainian',
  ka: 'Georgian',
  fa: 'Persian',
  ar: 'Arabic',
};

// ---------- Layout primitives ----------
export function Card({
  title,
  subtitle,
  action,
  children,
  className = '',
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`bg-white rounded-xl border border-gray-200 p-4 sm:p-5 min-w-0 ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-100 rounded animate-pulse ${className}`} />;
}

export function EmptyNote({ text = 'No data for this period yet.' }: { text?: string }) {
  return <p className="text-sm text-gray-400 py-6 text-center">{text}</p>;
}

/** Horizontal proportional bar used inside lists and tables. */
export function Bar({ value, max, color = COLORS.blue }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.max(2, (value / max) * 100) : 0;
  return (
    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${value > 0 ? pct : 0}%`, backgroundColor: color }} />
    </div>
  );
}

export interface ListRow {
  key: string;
  label: string;
  value: number;
  color?: string;
  sub?: string;
}

/** Label + value + proportional bar list. */
export function BarList({ rows, valueSuffix = '' }: { rows: ListRow[]; valueSuffix?: string }) {
  const max = Math.max(...rows.map((r) => r.value), 0);
  if (rows.length === 0) return <EmptyNote />;
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.key}>
          <div className="flex items-baseline justify-between gap-3 text-sm mb-1">
            <span className="text-gray-700 truncate" title={r.label}>
              {r.label}
              {r.sub && <span className="text-gray-400 text-xs ml-1.5">{r.sub}</span>}
            </span>
            <span className="text-gray-900 font-medium tabular-nums shrink-0">
              {fmtNumber(r.value)}
              {valueSuffix}
            </span>
          </div>
          <Bar value={r.value} max={max} color={r.color} />
        </li>
      ))}
    </ul>
  );
}

export interface DonutDatum {
  name: string;
  value: number;
  color: string;
}

export function Donut({ data, centerLabel }: { data: DonutDatum[]; centerLabel?: string }) {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  return (
    <div className="relative h-40 w-40 shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={total > 0 ? data : [{ name: 'No data', value: 1, color: '#f3f4f6' }]}
            dataKey="value"
            nameKey="name"
            innerRadius={48}
            outerRadius={72}
            paddingAngle={total > 0 && data.length > 1 ? 2 : 0}
            stroke="#ffffff"
            strokeWidth={2}
            isAnimationActive={false}
          >
            {(total > 0 ? data : [{ color: '#f3f4f6' }]).map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          {total > 0 && (
            <Tooltip
              formatter={(value, name) => [`${fmtNumber(Number(value))} (${fmtPercent(Number(value) / total, 0)})`, String(name)]}
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-lg font-bold text-gray-900 tabular-nums">{fmtCompact(total)}</span>
        {centerLabel && <span className="text-[10px] uppercase tracking-wide text-gray-400">{centerLabel}</span>}
      </div>
    </div>
  );
}

export function DonutLegend({ data }: { data: DonutDatum[] }) {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  return (
    <ul className="space-y-2 min-w-0 flex-1">
      {data.map((d) => (
        <li key={d.name} className="flex items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2 min-w-0">
            <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-gray-700 truncate">{d.name}</span>
          </span>
          <span className="text-gray-900 font-medium tabular-nums shrink-0">
            {fmtNumber(d.value)}
            <span className="text-gray-400 text-xs font-normal ml-1.5">{total > 0 ? fmtPercent(d.value / total, 0) : '—'}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
