import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    { day: 8, color: 'bg-primary', label: 'Med' },
    { day: 12, color: 'bg-secondary', label: 'Appt' },
    { day: 15, color: 'bg-primary', label: 'Today' },
    { day: 20, color: 'bg-primary', label: 'Med' },
    { day: 25, color: 'bg-secondary', label: 'Check' },
  ];

  const upcomingEvents = [
    { title: 'Blood pressure check', time: 'Today, 2:00 PM', icon: 'favorite', color: 'bg-secondary-container text-on-secondary-container' },
    { title: 'Medication refill reminder', time: 'Tomorrow, 9:00 AM', icon: 'medication', color: 'bg-primary-container text-on-primary-container' },
    { title: 'Doctor appointment', time: 'Mar 20, 10:30 AM', icon: 'local_hospital', color: 'bg-on-tertiary-container/10 text-on-tertiary-container' },
  ];

  return (
    <div className="pb-28 pt-4 px-5 min-h-dvh">
      {/* Header */}
      <div className="flex items-center gap-3 mb-7 animate-fade-in-up">
        <button onClick={() => navigate(-1)} className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center card-hover">
          <span className="material-symbols-outlined text-on-surface" style={{ fontSize: '24px' }}>arrow_back</span>
        </button>
        <div>
          <h1 className="text-xl font-bold text-on-surface">Calendar</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">Schedule & reminders</p>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="glass-card rounded-3xl p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-5">
          <button className="w-10 h-10 glass-card rounded-xl flex items-center justify-center card-hover">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '22px' }}>chevron_left</span>
          </button>
          <h2 className="text-lg font-semibold text-on-surface">{months[month]} {year}</h2>
          <button className="w-10 h-10 glass-card rounded-xl flex items-center justify-center card-hover">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '22px' }}>chevron_right</span>
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1.5 mb-3">
          {daysOfWeek.map((d, i) => (
            <div key={i} className="text-center text-[11px] font-semibold text-outline py-1.5">{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map((d, i) => {
            const event = events.find(e => e.day === d.day && d.currentMonth);
            return (
              <button
                key={i}
                className={`relative aspect-square flex flex-col items-center justify-center rounded-2xl text-sm transition-all card-hover ${
                  d.isToday ? 'bg-primary text-on-primary font-bold shadow-lg shadow-primary/20' :
                  d.currentMonth ? 'text-on-surface hover:bg-surface-container' :
                  'text-outline/30'
                }`}
              >
                {d.day}
                {event && !d.isToday && (
                  <div className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${event.color}`}></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-lg font-semibold text-on-surface mb-4">Upcoming Events</h2>
        <div className="space-y-3 stagger-children">
          {upcomingEvents.map((event, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 flex items-center gap-3.5 card-hover animate-fade-in-up">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${event.color}`}>
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{event.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface">{event.title}</p>
                <p className="text-[11px] text-outline mt-0.5">{event.time}</p>
              </div>
              <span className="material-symbols-outlined text-outline flex-shrink-0" style={{ fontSize: '18px' }}>chevron_right</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
