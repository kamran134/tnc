'use client';

import { useId, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { sanitizeHtml } from '@/lib/sanitize';
import type { ServiceDto } from '@/types/api';

interface ServiceAccordionProps {
  services: ServiceDto[];
  /** Expand the first item initially. */
  openFirst?: boolean;
}

export default function ServiceAccordion({ services, openFirst = true }: ServiceAccordionProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<number | null>(openFirst && services.length > 0 ? services[0].id : null);

  return (
    <div className="flex flex-col gap-3">
      {services.map((service) => {
        const isOpen = openId === service.id;
        const panelId = `${baseId}-panel-${service.id}`;
        return (
          <div key={service.id} className="overflow-hidden rounded-[10px] border border-navy-line bg-navy-800">
            <h3 className="m-0">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : service.id)}
                className="box-border flex min-h-[64px] w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-6 py-3.5 text-left text-lg font-semibold text-navy-text transition-colors hover:bg-navy-700 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-navy-accent"
              >
                <span>{service.title}</span>
                {isOpen ? (
                  <Minus className="h-[22px] w-[22px] flex-none text-navy-accent" aria-hidden="true" />
                ) : (
                  <Plus className="h-[22px] w-[22px] flex-none text-navy-accent" aria-hidden="true" />
                )}
              </button>
            </h3>
            {isOpen && (
              <div id={panelId} role="region" className="px-6 pb-6 pt-1">
                {service.excerpt && (
                  <div
                    className="site-prose mb-4 text-navy-text2"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(service.excerpt) }}
                  />
                )}
                <div className="site-prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(service.content) }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
