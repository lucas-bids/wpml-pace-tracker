import { Navigation } from './components/Navigation';
import { QuickAddCard } from './components/QuickAddCard';
import { MonthStatsCard } from './components/MonthStatsCard';
import { DayTicketsCard } from './components/DayTicketsCard';
import { Settings } from './pages/Settings';
import { useLocation, useNavigate } from 'react-router-dom';

interface Ticket {
  id: string;
  title: string;
  type: 'Forum' | 'Chat';
  date: Date;
}

interface MonthSettings {
  dailyGoal: number;
  extraTaskHours: number;
  daysOff: number[];
}

interface AppProps {
  settingsPage?: boolean;
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  tickets: Ticket[];
  onAddTicket: (url: string, type: 'Forum' | 'Chat', date: Date) => void;
  onDeleteTicket: (id: string) => void;
  monthSettings: MonthSettings;
  updateMonthSettings: (settings: MonthSettings) => void;
}
export function App({
  settingsPage = false,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  tickets,
  onAddTicket,
  onDeleteTicket,
  monthSettings,
  updateMonthSettings
}: AppProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const handleUpdateMonthSettings = (newSettings: MonthSettings) => {
    updateMonthSettings(newSettings);
    if (location.pathname === '/settings') {
      navigate('/');
    }
  };
  // If on settings page, render the Settings component
  if (settingsPage) {
    return <div className="min-h-screen w-full bg-[#f8f9fc] text-gray-800">
        <Navigation currentMonth={currentMonth} onPrevMonth={onPrevMonth} onNextMonth={onNextMonth} />
        <Settings settings={monthSettings} onUpdateSettings={handleUpdateMonthSettings} currentMonth={currentMonth} />
      </div>;
  }
  // Otherwise render the main dashboard
  return <div className="min-h-screen w-full bg-[#f8f9fc] text-gray-800">
      <Navigation currentMonth={currentMonth} onPrevMonth={onPrevMonth} onNextMonth={onNextMonth} />
      <main className="flex-1 px-6 py-8 pt-32">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Ticket Pace
            </h1>
            <p className="text-gray-500 mt-2">
              Track and manage your support ticket workflow
            </p>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <QuickAddCard onAddTicket={onAddTicket} />
            <MonthStatsCard tickets={tickets} currentMonth={currentMonth} monthSettings={monthSettings} />
            <div className="lg:col-span-2">
              <DayTicketsCard tickets={tickets.filter(ticket => {
              const today = new Date();
              const ticketDate = new Date(ticket.date);
              return ticketDate.toDateString() === today.toDateString();
            })} onDeleteTicket={onDeleteTicket} />
            </div>
          </div>
        </div>
      </main>
    </div>;
}