'use client';

import { useState } from 'react';
import type { TrafficAnalyticsDto, TrafficContentItemDto } from '@/types/api';
import {
  BarList,
  COLORS,
  Card,
  DEVICE_COLOR,
  DEVICE_LABEL,
  Donut,
  DonutLegend,
  EmptyNote,
  fmtNumber,
} from './shared';

type Tab = 'news' | 'careers' | 'services';

const TABS: { key: Tab; label: string }[] = [
  { key: 'news', label: 'News' },
  { key: 'careers', label: 'Careers' },
  { key: 'services', label: 'Services' },
];

function ContentTable({ items }: { items: TrafficContentItemDto[] }) {
  if (items.length === 0) return <EmptyNote />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[300px]">
        <thead>
          <tr className="text-xs text-gray-500 uppercase tracking-wide text-left">
            <th className="font-medium pb-2">Title</th>
            <th className="font-medium pb-2 pl-3 text-right">Views</th>
            <th className="font-medium pb-2 pl-3 text-right">Visitors</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((it) => (
            <tr key={it.slug}>
              <td className="py-2.5 max-w-[240px]">
                <p className="text-gray-900 font-medium truncate" title={it.title || it.slug}>
                  {it.title || it.slug}
                </p>
                {it.title && (
                  <p className="text-xs text-gray-400 truncate" title={it.slug}>
                    {it.slug}
                  </p>
                )}
              </td>
              <td className="py-2.5 pl-3 text-right font-medium text-gray-900 tabular-nums">{fmtNumber(it.views)}</td>
              <td className="py-2.5 pl-3 text-right text-gray-700 tabular-nums">{fmtNumber(it.visitors)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PopularContentCard({ data }: { data: TrafficAnalyticsDto }) {
  const [tab, setTab] = useState<Tab>('news');
  return (
    <Card
      title="Popular content"
      subtitle="Most viewed items"
      action={
        <div className="inline-flex rounded-lg bg-gray-100 p-0.5" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      }
    >
      <ContentTable items={data.topContent[tab]} />
    </Card>
  );
}

/** Top-N with the remainder folded into "Other". */
function topWithOther(rows: { name: string; visitors: number }[], limit: number) {
  const head = rows.slice(0, limit);
  const rest = rows.slice(limit).reduce((acc, r) => acc + r.visitors, 0);
  return rest > 0 ? [...head, { name: 'Other', visitors: rest }] : head;
}

export function DevicesTechCard({ data }: { data: TrafficAnalyticsDto }) {
  const devices = data.devices.map((d) => ({
    name: DEVICE_LABEL[d.name] ?? d.name,
    value: d.visitors,
    color: DEVICE_COLOR[d.name] ?? COLORS.other,
  }));
  const toRows = (rows: { name: string; visitors: number }[]) =>
    topWithOther(rows, 6).map((r) => ({
      key: r.name,
      label: r.name,
      value: r.visitors,
      color: r.name === 'Other' ? COLORS.other : COLORS.blue,
    }));

  return (
    <Card title="Devices & tech" subtitle="Unique visitors">
      {devices.length === 0 ? (
        <EmptyNote />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-center gap-5 mb-5">
            <Donut data={devices} centerLabel="visitors" />
            <DonutLegend data={devices} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">Browsers</p>
              <BarList rows={toRows(data.browsers)} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">Operating systems</p>
              <BarList rows={toRows(data.os)} />
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
