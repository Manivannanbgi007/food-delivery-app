import { Briefcase, Home, MapPin } from 'lucide-react';

import { Badge } from '@/components/common/Badge';
import { ADDRESS_TYPE_LABELS } from '@/utils/constants';
import { addressLines } from '@/utils/shoppingUtils';

const ICONS = { HOME: Home, WORK: Briefcase, OTHER: MapPin };

/** A saved address: its kind, whether it is the default, the address itself, and the actions given. */
export function AddressCard({ address, actions }) {
  const Icon = ICONS[address.type];
  return (
    <article className="flex flex-col gap-3 rounded-2xl bg-surface p-5 shadow-card">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-text">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <h3 className="font-bold">{ADDRESS_TYPE_LABELS[address.type]}</h3>
        {address.defaultAddress && <Badge tone="success">Default</Badge>}
      </div>
      <p className="text-sm">
        {addressLines(address).map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
      {actions && <div className="mt-auto flex flex-wrap gap-2 pt-2">{actions}</div>}
    </article>
  );
}
