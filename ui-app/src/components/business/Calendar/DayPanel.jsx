import { DayEventList } from '@/components/business/Calendar/DayEventList';
import { Modal } from '@/components/common/Modal';
import { longDate } from '@/utils/calendarUtils';
import { parseIsoDate } from '@/utils/dateUtils';

/** The details of one day in a dialog: its events by type, with the links to their pages. */
export function DayPanel({ date, events, onClose }) {
  return (
    <Modal open={date !== null} onClose={onClose} title={date ? longDate(parseIsoDate(date)) : ''}>
      {date && <DayEventList date={date} events={events} />}
    </Modal>
  );
}
