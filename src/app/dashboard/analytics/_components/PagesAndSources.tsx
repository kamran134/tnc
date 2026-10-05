'use client';

import type { TrafficAnalyticsDto } from '@/types/api';
import {
  Bar,
  COLORS,
  Card,
  Donut,
  DonutLegend,
  EmptyNote,
  SOURCE_TYPE_COLOR,
  SOURCE_TYPE_LABEL,
  fmtDuration,
  fmtNumber,
  pageLabel,
} from './shared';

export function TopPagesCard({ data }: { data: TrafficAnalyticsDto }) {
  const pages = data.topPages;
  const max = Math.max(...pages.map((p) => p.views), 0);
  return (
    <Card title="Top pages" subtitle="By pageviews">
      {pages.length === 0 ? (
        <EmptyNote />
      ) : (
        <div className="overflow-x-auto -mx-1 px-1">
          <table className="w-full text-sm min-w-[420px]">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wide text-left">
                <th className="font-medium pb-2">Page</th>
                <th className="font-medium pb-2 pl-3 text-right">Views</th>
                <th className="font-medium pb-2 pl-3 text-right">Visitors</th>
                <th className="font-medium pb-2 pl-3 text-right">Avg. time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pages.map((p) => (
                <tr key={p.path}>
                  <td className="py-2.5 max-w-[220px]">
                    <p className="text-gray-900 font-medium truncate" title={pageLabel(p)}>
                      {pageLabel(p)}
                    </p>
                    <p className="text-xs text-gray-400 truncate" title={p.path}>
                      {p.path}
                    </p>
                  </td>
                  <td className="py-2.5 pl-3 w-32">
                    <div className="text-right font-medium text-gray-900 tabular-nums mb-1">{fmtNumber(p.views)}</div>
                    <Bar value={p.views} max={max} color={COLORS.blue} />
                  </td>
                  <td className="py-2.5 pl-3 text-right text-gray-700 tabular-nums">{fmtNumber(p.visitors)}</td>
                  <td className="py-2.5 pl-3 text-right text-gray-700 tabular-nums">
                    {p.avgDurationSec > 0 ? fmtDuration(p.avgDurationSec) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export function SourcesCard({ data }: { data: TrafficAnalyticsDto }) {
  const donut = data.sourceTypes
    .filter((s) => s.sessions > 0)
    .map((s) => ({ name: SOURCE_TYPE_LABEL[s.type] ?? s.type, value: s.sessions, color: SOURCE_TYPE_COLOR[s.type] ?? COLORS.other }));
  const maxSessions = Math.max(...data.sources.map((s) => s.sessions), 0);

  return (
    <Card title="Traffic sources" subtitle="Sessions by entry source">
      {donut.length === 0 ? (
        <EmptyNote />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-center gap-5 mb-5">
            <Donut data={donut} centerLabel="sessions" />
            <DonutLegend data={donut} />
          </div>
          <ul className="space-y-2.5">
            {data.sources.map((s) => (
              <li key={`${s.type}-${s.source}`}>
                <div className="flex items-center justify-between gap-3 text-sm mb-1">
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="text-gray-800 truncate" title={s.source}>
                      {s.source}
                    </span>
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 shrink-0"
                      style={{ boxShadow: `inset 3px 0 0 ${SOURCE_TYPE_COLOR[s.type] ?? COLORS.other}`, paddingLeft: 8 }}
                    >
                      {SOURCE_TYPE_LABEL[s.type] ?? s.type}
                    </span>
                  </span>
                  <span className="text-gray-900 font-medium tabular-nums shrink-0">
                    {fmtNumber(s.sessions)}
                    <span className="text-gray-400 text-xs font-normal ml-1.5">{fmtNumber(s.visitors)} vis.</span>
                  </span>
                </div>
                <Bar value={s.sessions} max={maxSessions} color={SOURCE_TYPE_COLOR[s.type] ?? COLORS.other} />
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
