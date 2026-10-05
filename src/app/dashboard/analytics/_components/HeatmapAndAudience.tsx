'use client';

import type { TrafficAnalyticsDto, TrafficNamedCountDto } from '@/types/api';
import {
  BROWSER_LANGUAGE_LABEL,
  BarList,
  COLORS,
  Card,
  EmptyNote,
  SITE_LANGUAGE_LABEL,
  fmtNumber,
  timezoneLabel,
} from './shared';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function hourLabel(h: number): string {
  return `${String(h).padStart(2, '0')}:00`;
}

export function HeatmapCard({ data }: { data: TrafficAnalyticsDto }) {
  const grid = new Map<string, number>();
  let max = 0;
  for (const c of data.heatmap) {
    grid.set(`${c.weekday}-${c.hour}`, c.pageviews);
    if (c.pageviews > max) max = c.pageviews;
  }

  return (
    <Card title="When people visit" subtitle="Pageviews by weekday and hour (Baku time)">
      {max === 0 ? (
        <EmptyNote />
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[520px]">
            <div className="grid gap-[3px]" style={{ gridTemplateColumns: '32px repeat(24, minmax(0, 1fr))' }}>
              {WEEKDAYS.map((day, di) => (
                <div key={day} className="contents">
                  <div className="text-[10px] text-gray-500 flex items-center">{day}</div>
                  {HOURS.map((h) => {
                    const v = grid.get(`${di + 1}-${h}`) ?? 0;
                    const opacity = v > 0 ? 0.18 + 0.82 * (v / max) : 0;
                    return (
                      <div
                        key={h}
                        title={`${day} ${hourLabel(h)} — ${fmtNumber(v)} pageview${v === 1 ? '' : 's'}`}
                        className="aspect-square rounded-[3px] bg-gray-100 relative overflow-hidden"
                      >
                        {v > 0 && (
                          <div className="absolute inset-0" style={{ backgroundColor: COLORS.blue, opacity }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
              <div />
              {HOURS.map((h) => (
                <div key={h} className="text-[9px] text-gray-400 text-center">
                  {h % 3 === 0 ? h : ''}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 mt-3 text-[10px] text-gray-400">
              <span>Less</span>
              {[0.18, 0.4, 0.6, 0.8, 1].map((o) => (
                <span key={o} className="h-2.5 w-4 rounded-sm" style={{ backgroundColor: COLORS.blue, opacity: o }} />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function rowsFrom(items: TrafficNamedCountDto[], label: (name: string) => string, limit?: number) {
  return (limit ? items.slice(0, limit) : items).map((i) => ({
    key: i.name,
    label: label(i.name),
    value: i.visitors,
    color: COLORS.blue,
  }));
}

export function AudienceCard({ data }: { data: TrafficAnalyticsDto }) {
  const empty = data.siteLanguages.length === 0 && data.browserLanguages.length === 0 && data.timezones.length === 0;
  return (
    <Card title="Audience" subtitle="Unique visitors">
      {empty ? (
        <EmptyNote />
      ) : (
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">Site language</p>
            <BarList rows={rowsFrom(data.siteLanguages, (n) => SITE_LANGUAGE_LABEL[n] ?? n.toUpperCase())} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">Browser language</p>
              <BarList rows={rowsFrom(data.browserLanguages, (n) => BROWSER_LANGUAGE_LABEL[n] ?? n.toUpperCase(), 6)} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">Location (timezone)</p>
              <BarList rows={rowsFrom(data.timezones, timezoneLabel, 8)} />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
