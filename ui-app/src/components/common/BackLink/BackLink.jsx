import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';

/** "< Back to orders" above a details page. */
export function BackLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="inline-flex items-center gap-1 text-sm font-semibold text-brand-text hover:underline"
    >
      <ChevronLeft aria-hidden="true" className="size-4" />
      {children}
    </Link>
  );
}
