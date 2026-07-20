import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Calendar() {
  const navigate = useNavigate();
  const [currentDate] = useState(new Date(2025, 2, 15));

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
    calendarDays.push({ day: i, currentMonth: true, isToday: i === 15 });
  }
  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({ day: i, currentMonth: false });
  }

  const events = [
    { day: 8, type: 'medicine', label: 'Med' },
    { day: 12, type: 'health', label: 'Appt' },
    { day: 15, type: 'feeding', label: 'Today' },
    { day: 20, type: 'medicine', label: 'Med' },
    { day: 25, type: 'health', label: 'Check' },
  ];

  const upcomingEvents = [
    { title: 'Blood pressure check', time: 'Today, 2:00 PM', type: 'health', icon: 'favorite' },
    { title: 'Medication refill reminder', time: 'Tomorrow, 9:00 AM', type: 'medicine', icon: 'medication' },
    { title: 'Doctor appointment', time: 'Mar 20, 10:30 AM', type: 'health', icon: 'local_hospital' },
  ];

  return (
    <div className="pb-28 pt-5 px-5 min-h-dvh">
      <PageHeader title="Calendar" subtitle="Schedule & reminders" onBack />

      {/* Calendar Card */}
      <Card className="mb-5 animate-fade-in-up" padding="p-5">
        <div className="flex items-center justify-between mb-4">
          <button className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center card-hover">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '20px' }}>chevron_left</span>
          </button>
          <h2 className="text-base font-bold text-on-surface">{months[month]} {year}</h2>
          <button className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center card-hover">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '20px' }}>chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
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
                className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all card-hover ${
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
      </Card>

      {/* Upcoming Events */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3">Upcoming</h2>
        <div className="space-y-2">
          {upcomingEvents.map((event, i) => (
            <Card key={i} className={`activity-${event.type}-border`} padding="p-3.5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg activity-${event.type}-bg flex items-center justify-center flex-shrink-0`}>
                  <span className={`material-symbols-outlined text-${event.type}`} style={{ fontSize: '20px' }}>{event.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface">{event.title}</p>
                  <p className="text-xs text-outline mt-0.5">{event.time}</p>
                </div>
                <span className="material-symbols-outlined text-outline" style={{ fontSize: '18px' }}>chevron_right</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
