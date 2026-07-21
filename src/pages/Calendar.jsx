import { useState } from 'react';
import PageHeader from '../components/PageHeader';

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Calendar() {
  const [currentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, currentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, currentMonth: true, isToday: i === currentDate.getDate() });
  }
  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({ day: i, currentMonth: false });
  }

  const events = [
    { day: 8, type: 'medicine', label: 'Med' },
    { day: 12, type: 'health', label: 'Appt' },
    { day: 20, type: 'medicine', label: 'Med' },
    { day: 25, type: 'health', label: 'Check' },
  ];

  const upcomingEvents = [
    { title: 'Blood pressure check', time: 'Today, 2:00 PM', type: 'health', icon: 'favorite' },
    { title: 'Medication refill reminder', time: 'Tomorrow, 9:00 AM', type: 'medicine', icon: 'medication' },
    { title: 'Doctor appointment', time: 'Mar 20, 10:30 AM', type: 'health', icon: 'local_hospital' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Calendar" subtitle="Schedule & reminders" onBack />

      {/* Calendar Grid */}
      <div className="card p-4 animate-fade-in-up">
        <div className="flex items-center justify-between mb-3">
          <button className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center card-interactive">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">chevron_left</span>
          </button>
          <h2 className="text-base font-bold text-on-surface">{months[month]} {year}</h2>
          <button className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center card-interactive">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {daysOfWeek.map((d, i) => (
            <div key={i} className="text-center text-[11px] font-semibold text-outline py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((d, i) => {
            const event = events.find(e => e.day === d.day && d.currentMonth);
            return (
              <button
                key={i}
                className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all card-interactive ${
                  d.isToday ? 'bg-primary text-on-primary font-bold' :
                  d.currentMonth ? 'text-on-surface hover:bg-surface-container-low' :
                  'text-outline/25'
                }`}
              >
                {d.day}
                {event && !d.isToday && (
                  <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full bg-${event.type}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Upcoming */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.03s' }}>
        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Upcoming</h2>
        <div className="flex flex-col gap-2">
          {upcomingEvents.map((event, i) => (
            <div key={i} className={`card p-3 activity-${event.type}-border`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg activity-${event.type}-bg flex items-center justify-center flex-shrink-0`}>
                  <span className={`material-symbols-outlined text-${event.type} text-[18px]`}>{event.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface">{event.title}</p>
                  <p className="text-xs text-outline mt-0.5">{event.time}</p>
                </div>
                <span className="material-symbols-outlined text-outline text-[18px] flex-shrink-0">chevron_right</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
