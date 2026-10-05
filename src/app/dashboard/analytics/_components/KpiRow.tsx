'use client';

import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import type { TrafficAnalyticsDto, TrafficSummaryDto, TrafficTimeseriesPointDto } from '@/types/api';
import { COLORS, Skeleton, fmtCompact, fmtDuration, fmtPercent } from './shared';

interface KpiDef {
  key: string;
  label: string;
  value: (s: TrafficSummaryDto) => number;
  format: (v: number) => string;
  /** true when a decrease is the good direction */
  lowerIsBetter?: boolean;
  spark?: (p: TrafficTimeseriesPointDto) => number;
  /** show delta as percentage-point difference instead of relative change */
  deltaInPoints?: boolean;
}

const KPIS: KpiDef[] = [
  { key: 'visitors', label: 'Visitors', value: (s) => s.visitors, format: fmtCompact, spark: (p) => p.visitors },
  { key: 'pageviews', label: 'Pageviews', value: (s) => s.pageviews, format: fmtCompact, spark: (p) => p.pageviews },
  { key: 'sessions', label: 'Sessions', value: (s) => s.sessions, format: fmtCompact, spark: (p) => p.sessions },
  {
    key: 'bounce',
    label: 'Bounce rate',
    value: (s) => s.bounceRate,
    format: (v) => fmtPercent(v, 1),
    lowerIsBetter: true,
    deltaInPoints: true,
  },
  { key: 'avg', label: 'Avg. session', value: (s) => s.avgSessionDurationSec, format: fmtDuration },
  {
    key: 'conversion',
    label: 'Conversion',
    value: (s) => s.conversionRate,
    format: (v) => fmtPercent(v, 2),
    deltaInPoints: true,
    spark: (p) => p.contacts,
  },
];

function Delta({ current, previous, lowerIsBetter, inPoints }: { current: number; previous: number; lowerIsBetter?: boolean; inPoints?: boolean }) {
  if (!previous) {
    return <span className="text-xs text-gray-400">—</span>;
  }
  const diff = inPoints ? (current - previous) * 100 : ((current - previous) / previous) * 100;
  if (Math.abs(diff) < 0.05) {
    return <span className="text-xs text-gray-400">0%</span>;
  }
  const up = diff > 0;
  const good = lowerIsBetter ? !up : up;
  const text = inPoints ? `${Math.abs(diff).toFixed(1)} pp` : `${Math.abs(diff).toFixed(Math.abs(diff) >= 100 ? 0 : 1)}%`;
  return (
    <span className={`text-xs font-medium ${good ? 'text-green-700' : 'text-red-600'}`}>
      {up ? '▲' : '▼'} {text}
    </span>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const points = data.map((v, i) => ({ i, v }));
  return (
    <div className="h-8 w-full mt-2" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={color}
            fillOpacity={0.12}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function KpiRow({ data }: { data: TrafficAnalyticsDto | undefined }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {KPIS.map((kpi) => (
        <div key={kpi.key} className="bg-white rounded-xl border border-gray-200 p-4 min-w-0">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1 truncate">{kpi.label}</p>
          {data ? (
            <>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{kpi.format(kpi.value(data.summary))}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Delta
                  current={kpi.value(data.summary)}
                  previous={kpi.value(data.previous)}
                  lowerIsBetter={kpi.lowerIsBetter}
                  inPoints={kpi.deltaInPoints}
                />
                <span className="text-[10px] text-gray-400">vs prev.</span>
              </div>
              {kpi.spark ? (
                <Sparkline data={data.timeseries.map(kpi.spark)} color={COLORS.blue} />
              ) : (
                <div className="h-8 mt-2" />
              )}
            </>
          ) : (
            <>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-8 w-full" />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
