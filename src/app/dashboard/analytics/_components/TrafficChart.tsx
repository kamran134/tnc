'use client';

import { useState } from 'react';
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TrafficAnalyticsDto } from '@/types/api';
import { COLORS, Card, fmtCompact, fmtLongDate, fmtNumber, fmtShortDate } from './shared';

type SeriesKey = 'visitors' | 'pageviews' | 'contacts';

const SERIES: { key: SeriesKey; label: string; color: string }[] = [
  { key: 'visitors', label: 'Visitors', color: COLORS.blue },
  { key: 'pageviews', label: 'Pageviews', color: COLORS.orange },
  { key: 'contacts', label: 'Contacts', color: COLORS.aqua },
];

interface TooltipEntry {
  dataKey?: string | number;
  value?: number | string;
  payload?: { date?: string; sessions?: number };
}

function ChartTooltip({
  active,
  payload,
  granularity,
  visible,
}: {
  active?: boolean;
  payload?: ReadonlyArray<TooltipEntry>;
  granularity: 'DAY' | 'MONTH';
  visible: Record<SeriesKey, boolean>;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload as
    | { date: string; visitors: number; pageviews: number; sessions: number; contacts: number }
    | undefined;
  if (!point) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="font-semibold text-gray-900 mb-1.5">{fmtLongDate(point.date, granularity)}</p>
      <ul className="space-y-1">
        {SERIES.filter((s) => visible[s.key]).map((s) => (
          <li key={s.key} className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-1.5 text-gray-600">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
            <span className="font-medium text-gray-900 tabular-nums">{fmtNumber(point[s.key])}</span>
          </li>
        ))}
        <li className="flex items-center justify-between gap-6 pt-1 border-t border-gray-100">
          <span className="text-gray-500">Sessions</span>
          <span className="font-medium text-gray-900 tabular-nums">{fmtNumber(point.sessions)}</span>
        </li>
      </ul>
    </div>
  );
}

export function TrafficChart({ data }: { data: TrafficAnalyticsDto }) {
  const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({ visitors: true, pageviews: true, contacts: true });
  const granularity = data.range.granularity;
  const series = data.timeseries;
  const tickCount = series.length > 45 ? 8 : series.length > 14 ? 6 : series.length;
  const interval = Math.max(0, Math.ceil(series.length / Math.max(tickCount, 1)) - 1);

  const toggle = (key: SeriesKey) => setVisible((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <Card
      title="Traffic"
      subtitle={granularity === 'MONTH' ? 'Monthly totals' : 'Daily totals'}
      action={
        <div className="flex flex-wrap justify-end gap-1.5" role="group" aria-label="Toggle series">
          {SERIES.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => toggle(s.key)}
              aria-pressed={visible[s.key]}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                visible[s.key] ? 'border-gray-300 text-gray-800 bg-white' : 'border-gray-200 text-gray-400 bg-gray-50'
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: visible[s.key] ? s.color : '#d1d5db' }} />
              {s.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={COLORS.grid} vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(v: string) => fmtShortDate(v, granularity)}
              interval={interval}
              tick={{ fontSize: 11, fill: COLORS.axis }}
              tickLine={false}
              axisLine={{ stroke: COLORS.grid }}
              minTickGap={16}
            />
            <YAxis
              allowDecimals={false}
              tickFormatter={(v: number) => fmtCompact(v)}
              tick={{ fontSize: 11, fill: COLORS.axis }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              cursor={{ stroke: '#9ca3af', strokeDasharray: '3 3' }}
              content={<ChartTooltip granularity={granularity} visible={visible} />}
            />
            {visible.pageviews && (
              <Area
                type="monotone"
                dataKey="pageviews"
                stroke={COLORS.orange}
                strokeWidth={2}
                fill={COLORS.orange}
                fillOpacity={0.1}
                dot={false}
                activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            )}
            {visible.visitors && (
              <Area
                type="monotone"
                dataKey="visitors"
                stroke={COLORS.blue}
                strokeWidth={2}
                fill={COLORS.blue}
                fillOpacity={0.14}
                dot={false}
                activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {visible.contacts && (
        <div className="mt-2">
          <p className="text-[11px] text-gray-500 font-medium mb-1">Contact submissions</p>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series} margin={{ top: 2, right: 8, bottom: 0, left: 40 }}>
                <XAxis dataKey="date" hide />
                <YAxis hide allowDecimals={false} domain={[0, (max: number) => Math.max(max, 1)]} />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                  content={<ChartTooltip granularity={granularity} visible={{ visitors: false, pageviews: false, contacts: true }} />}
                />
                <Bar
                  dataKey="contacts"
                  fill={COLORS.aqua}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={14}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Card>
  );
}
