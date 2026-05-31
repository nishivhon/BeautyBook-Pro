import { useEffect, useState } from 'react';

const formatISODate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseISODate = (value) => {
  const [year, month, day] = String(value).split('-').map(Number);
  return new Date(year, month - 1, day);
};

export default function DateRangePicker({ open, initialRange = null, onClose, onConfirm }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = formatISODate(today);

  const defaultPast = new Date(today);
  defaultPast.setDate(defaultPast.getDate() - 1);
  const defaultPastISO = formatISODate(defaultPast);

  const [summaryRange, setSummaryRange] = useState(() => initialRange || { startDate: defaultPastISO, endDate: defaultPastISO });
  const [awaitingEndDate, setAwaitingEndDate] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(defaultPast.getFullYear(), defaultPast.getMonth(), 1));

  useEffect(() => {
    if (initialRange) setSummaryRange(initialRange);
  }, [initialRange]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const firstDayOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);
  const leadingEmptyDays = firstDayOfMonth.getDay();
  const totalSlots = Math.ceil((leadingEmptyDays + lastDayOfMonth.getDate()) / 7) * 7;
  const dayCells = Array.from({ length: totalSlots }, (_, index) => {
    const dayNumber = index - leadingEmptyDays + 1;
    if (dayNumber < 1 || dayNumber > lastDayOfMonth.getDate()) return null;
    const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), dayNumber);
    const iso = formatISODate(date);
    return { dayNumber, iso };
  });

  const handleDayClick = (iso) => {
    if (!iso || iso >= todayISO) return;

    if (!awaitingEndDate) {
      setSummaryRange({ startDate: iso, endDate: iso });
      setAwaitingEndDate(true);
      return;
    }

    if (iso < summaryRange.startDate) {
      setSummaryRange({ startDate: iso, endDate: iso });
      setAwaitingEndDate(true);
      return;
    }

    const nextRange = { startDate: summaryRange.startDate, endDate: iso };
    setSummaryRange(nextRange);
    setAwaitingEndDate(false);
    onConfirm && onConfirm(nextRange);
  };

  return (
    <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 220, borderRadius: 8, border: '1px solid rgba(221, 144, 29, 0.25)', background: '#fff', boxShadow: '0 7px 14px rgba(0,0,0,0.1)', padding: 6, zIndex: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <button type="button" onClick={() => setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} style={{ border: 'none', background: 'transparent', color: '#6e4b12', fontWeight: 700, cursor: 'pointer', fontSize: 11 }}> {'<'} </button>
        <span style={{ fontWeight: 700, color: '#2f220f', fontSize: 11 }}>{calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        <button type="button" onClick={() => setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} style={{ border: 'none', background: 'transparent', color: '#6e4b12', fontWeight: 700, cursor: 'pointer', fontSize: 11 }}>{'>'}</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} style={{ textAlign: 'center', fontSize: 8, color: '#9f8457', fontWeight: 700 }}>{d}</div>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {dayCells.map((cell, index) => {
          if (!cell) return <div key={`empty-${index}`} />;
          if (cell.iso === todayISO) return <div key={`today-hidden-${cell.iso}`} />;

          const isStart = cell.iso === summaryRange.startDate;
          const isEnd = !awaitingEndDate && cell.iso === summaryRange.endDate;
          const inBetween = !awaitingEndDate && cell.iso > summaryRange.startDate && cell.iso < summaryRange.endDate;

          return (
            <button key={cell.iso} type="button" onClick={() => handleDayClick(cell.iso)} style={{ height: 22, borderRadius: 5, border: isStart || isEnd ? '1px solid #DD901D' : '1px solid transparent', background: isStart || isEnd ? '#DD901D' : inBetween ? '#fdeed6' : 'transparent', color: isStart || isEnd ? '#fff' : '#3f2d11', fontWeight: 600, fontSize: 9, cursor: 'pointer' }}>{cell.dayNumber}</button>
          );
        })}
      </div>

      <div style={{ height: 8 }} />
    </div>
  );
}
