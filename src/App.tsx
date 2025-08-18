import { useState } from 'react';
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
}
export function App({
  settingsPage = false
}: AppProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();
  const location = useLocation();
  // Sample data for demonstration
  const [tickets, setTickets] = useState<Ticket[]>([{
    id: '1',
    title: 'Plugin activation issue',
    type: 'Forum',
    date: new Date()
  }, {
    id: '2',
    title: 'Translation not working',
    type: 'Chat',
    date: new Date()
  }, {
    id: '3',
    title: 'License renewal question',
    type: 'Forum',
    date: new Date()
  }]);
  const [monthSettings, setMonthSettings] = useState<MonthSettings>({
    dailyGoal: 8,
    extraTaskHours: 5,
    daysOff: [10, 11, 24] // Example days off in the month
  });
  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };
  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };
  const handleAddTicket = (url: string, type: 'Forum' | 'Chat') => {
    // Extract title from URL (simplified for demo)
    const urlParts = url.split('/');
    const slug = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
    const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const newTicket = {
      id: Date.now().toString(),
      title,
      type,
      date: new Date()
    };
    setTickets(prev => [newTicket, ...prev]);
  };
  const handleDeleteTicket = (id: string) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== id));
  };
  const updateMonthSettings = (newSettings: MonthSettings) => {
    setMonthSettings(newSettings);
    if (location.pathname === '/settings') {
      navigate('/');
    }
  };
  // If on settings page, render the Settings component
  if (settingsPage) {
    return <div className="min-h-screen w-full bg-[#f8f9fc] text-gray-800">
        <Navigation currentMonth={currentMonth} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} />
        <Settings settings={monthSettings} onUpdateSettings={updateMonthSettings} currentMonth={currentMonth} />
      </div>;
  }
  // Otherwise render the main dashboard
  return <div className="min-h-screen w-full bg-[#f8f9fc] text-gray-800">
      <Navigation currentMonth={currentMonth} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} />
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
            <QuickAddCard onAddTicket={handleAddTicket} />
            <MonthStatsCard tickets={tickets} currentMonth={currentMonth} monthSettings={monthSettings} />
            <div className="lg:col-span-2">
              <DayTicketsCard tickets={tickets.filter(ticket => {
              const today = new Date();
              const ticketDate = new Date(ticket.date);
              return ticketDate.toDateString() === today.toDateString();
            })} onDeleteTicket={handleDeleteTicket} />
            </div>
          </div>
        </div>
      </main>
    </div>;
}