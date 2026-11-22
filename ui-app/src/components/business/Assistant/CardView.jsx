import { EntitiesCard } from '@/components/business/Assistant/EntitiesCard';
import { StatsCard } from '@/components/business/Assistant/StatsCard';
import { TableCard } from '@/components/business/Assistant/TableCard';

/** One card of an answer, by its kind (a kind this version does not know is not drawn). */
export function CardView({ card }) {
  switch (card.kind) {
    case 'stats':
      return <StatsCard card={card} />;
    case 'table':
      return <TableCard card={card} />;
    case 'entities':
      return <EntitiesCard card={card} />;
    default:
      return null;
  }
}
